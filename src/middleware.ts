import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { JWTPayload, jwtVerify } from "jose";
import axiosInstance from "./shared/api/axiosInstance";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

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
  const cookiesStore = await cookies();
  cookiesStore.set("auth_redirected", "true", { maxAge: 60 });
  cookiesStore.delete("access_token");
  cookiesStore.delete("refresh_token");

  return NextResponse.redirect(new URL("/login", request.url));
}

async function refreshAccessToken(refreshToken: string, cookiesStore: ReadonlyRequestCookies, request: NextRequest, pathname: string) {
  try {
    const res = await axiosInstance.post("auth/refresh", {
      refresh_token: refreshToken,
    });
    const data = res.data; // Новый access_token
    console.log("Новый access token получен:", data.accessToken);

    cookiesStore.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
    });
    console.log("Oбновилили access_token в cookies");
    // Если был редирект на /login, то перенаправим на /
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log("Ошибка обновления токена, редирект на логин", error);
    return redirectToLogin(request);
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("access_token")?.value;
  const refreshToken = cookiesStore.get("refresh_token")?.value;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" || pathname === "/") {
    if (accessToken) {
      try {
        const payload = await verifyToken(accessToken); // Проверка токена
      if (payload) {
        const { userId, deratmentId } = payload;
        console.log("User already logged in, redirecting to /");
        return NextResponse.redirect(
          new URL(`/table/${deratmentId}/projects/${userId}`, request.url)
        );
      }
      } catch (error) {
        console.log("Access token недействителен, оставляем на /login", error);
      }
    }
    return NextResponse.next();
  }

  // // Если есть accessToken, проверяем его
  if (accessToken) {
    try {
      await jwtVerify(accessToken, secretKey); // Проверка токена
      return NextResponse.next();
    } catch (error) {
      console.log("Access token истёк, пробуем обновить...", error);
    }
  }
  // // Если нет refreshToken, редирект на логин
  if (!refreshToken) {
    console.log("Нет refresh token, редирект на логин");
    return redirectToLogin(request);
  }

  // // Попробуем обновить токен
  await refreshAccessToken(refreshToken, cookiesStore, request, pathname);
}


export const config = {
    matcher: ["/(dashboard | table | profile | login | summary-table | deal)/:path*", "/"],
};
