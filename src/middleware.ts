import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { jwtVerify } from "jose";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

async function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);

  const response = NextResponse.redirect(loginUrl);

  response.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
  response.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });

  return response;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;
  const refreshToken = cookiesStore.get("refreshToken")?.value;

  if (pathname === "/login" || pathname === "/") {
    if (accessToken) {
      try {
        await jwtVerify(accessToken, secretKey);

        return NextResponse.redirect(new URL("/dashboard", request.url)); 
      } catch (err) {
        console.log(err, "middleware error");
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return redirectToLogin(request);
  }

  if (accessToken) {
    try {
      await jwtVerify(accessToken, secretKey);
      return NextResponse.next();
    } catch (error) {
      console.log("Access token недействителен", error);
    }
  }

  if (refreshToken) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshToken }),
      });

      if (!res.ok) throw new Error("Ошибка обновления токенов");

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await res.json();

      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      if (newRefreshToken) {
        response.cookies.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
      }

      return response;
    } catch (error) {
      console.log("Ошибка обновления токенов:", error);
      return redirectToLogin(request);
    }
  }

  return redirectToLogin(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/login",
    "/dashboard/:path*",
    "/table/:path*",
    "/profile/:path*",
    "/summary-table/:path*",
    "/deal/:path*",
    "/statistics/:path*",
    "/calendar/:path*",
    "/tasks/:path*",
    "/orders/:path*",
    "/",
  ],
  // runtime: "experimental-edge",
};
