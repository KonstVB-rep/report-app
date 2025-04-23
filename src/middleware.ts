import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { JWTPayload, jwtVerify } from "jose";

import axiosInstance from "./shared/api/axiosInstance";

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

  // Удаляем куки в браузере
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  // Добавляем флаг для предотвращения зацикливания
  response.cookies.set("auth_redirected", "true", { maxAge: 2 });

  return response;
}

async function refreshAccessToken(
  refreshToken: string,
  cookiesStore: ReadonlyRequestCookies,
  request: NextRequest,
  pathname: string
) {
  try {
    const res = await axiosInstance.post("auth/refresh", {
      refresh_token: refreshToken,
    });

    const data = res.data;
    console.log("Новый access token получен:", data.accessToken);

    cookiesStore.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
    });

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

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

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" || pathname === "/") {
    if (accessToken) {
      try {
        const payload = await verifyToken(accessToken);
        if (payload) {
          const { userId, departmentId } = payload;
          return NextResponse.redirect(
            new URL(`/table/${departmentId}/projects/${userId}`, request.url)
          );
        }
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
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.log("Access token истёк, пробуем обновить...", error);
    }
  }

  if (!refreshToken) {
    return redirectToLogin(request);
  }

  return await refreshAccessToken(
    refreshToken,
    cookiesStore,
    request,
    pathname
  );
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/table/:path*",
    "/profile/:path*",
    "/summary-table/:path*",
    "/deal/:path*",
    "/statistics/:path*",
    "/",
  ],
};
