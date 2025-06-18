import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { JWTPayload, jwtVerify } from "jose";

import { redirectPathCore } from "./shared/lib/helpers/redirectPathCore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

async function redirectToLogin(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const response = NextResponse.redirect(new URL("/login", request.url));

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}

async function refreshAccessToken(
  refreshToken: string,
  cookiesStore: ReadonlyRequestCookies,
  request: NextRequest,
  // pathname: string
) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Ошибка запроса");

    const data = await res.json();
    console.log("Новый access token получен");

    cookiesStore.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
    });

    // if (pathname === "/") {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

    return NextResponse.next();
  } catch (error) {
    console.log("Ошибка обновления access token:", error);
    return redirectToLogin(request);
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;
  const refreshToken = cookiesStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return redirectToLogin(request);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-middleware-subrequest");

  if (pathname === "/login" || pathname === "/") {
    if (accessToken) {
      try {
        const payload = await verifyToken(accessToken);
        if (payload) {
          const { userId, departmentId } = payload;
          const url = redirectPathCore(Number(departmentId), userId as string);
          return NextResponse.redirect(new URL(url, request.url));
        }
        return NextResponse.next();
      } catch (error) {
        console.log("Access token недействителен, оставляем на /login", error);
      }
    }
    return NextResponse.next();
  }

  if (accessToken) {
    try {
      await jwtVerify(accessToken, secretKey);
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error) {
      console.log("Access token истёк, пробуем обновить...", error);
    }
  }

  if (!refreshToken) return redirectToLogin(request);

  return await refreshAccessToken(
    refreshToken,
    cookiesStore,
    request,
    // pathname
  );
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/table/:path*",
    "/profile/:path*",
    "/summary-table/:path*",
    "/deal/:path*",
    "/statistics/:path*",
    "/calendar/:path*",
    "/tasks/:path*",
    // "/",
  ],
};
