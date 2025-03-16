import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import axiosInstance from "./shared/api/axiosInstance";
import { cookies } from "next/headers";

export default async function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  // const cookiesStore = await cookies();
  // const accessToken = cookiesStore.get("access_token")?.value;
  // const refreshToken = cookiesStore.get("refresh_token")?.value;



  // if(pathname === "/") {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // if (pathname === "/login" || pathname === "/") {
  //   if (accessToken) {
  //     try {
  //       const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  //       const { payload } = await jwtVerify(accessToken, secretKey); // Проверка токена
  //       console.log('Decoded payload:', payload);
  //       console.log("Пользователь уже авторизован, редирект на /dashboard");
  //       return NextResponse.redirect(new URL("/dashboard", request.url));
  //     } catch (error) {
  //       console.log("Access token недействителен, оставляем на /login", error);
  //     }
  //   }
  //   return NextResponse.next();
  // }

  // // // Если есть accessToken, проверяем его
  // if (accessToken) {
   
  //   try {
  //     const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  //     await jwtVerify(accessToken, secretKey); // Проверка токена
  //     return NextResponse.next();
  //   } catch (error) {
  //     console.log("Access token истёк, пробуем обновить...", error);
  //   }
  // }
  // // console.log(pathname, "pathname");
  // // // Если нет refreshToken, редирект на логин
  // if (!refreshToken) {
  //   console.log("Нет refresh token, редирект на логин");
  //   return redirectToLogin(request);
  // }

  // // Попробуем обновить токен
  try {
    // const res = await axiosInstance.post("auth/refresh", {
    //   refresh_token: refreshToken,});
    // const data = res.data; // Новый access_token
    // console.log("Новый access token получен:", data.accessToken);

    // cookiesStore.set("access_token", data.accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== "development",
    //   sameSite: "strict",
    //   maxAge: 60, 
    // });
    // console.log("Oбновилили access_token в cookies");
    // // Если был редирект на /login, то перенаправим на /dashboard
    // if (pathname === "/login" || pathname === "/") {
    //   return NextResponse.redirect(new URL("/dashboard", request.url));
    // }

    return NextResponse.next();
  } catch (error) {
    console.log("Ошибка обновления токена, редирект на логин", error);
    return redirectToLogin(request);
  }
}

// Удаляем токены и редиректим на логин
async function redirectToLogin(request: NextRequest) {

  const cookiesStore = await cookies();
  cookiesStore.set("auth_redirected", "true", { maxAge: 60 });

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/"],
};
