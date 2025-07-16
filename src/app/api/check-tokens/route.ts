// app/api/check-tokens/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { jwtVerify } from "jose";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const accessTokenSecretKey = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
);
const refreshTokenSecretKey = new TextEncoder().encode(
  process.env.REFRESH_SECRET_KEY
);

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ isValid: false });
  }

  // Проверка access token
  if (accessToken) {
    try {
      await jwtVerify(accessToken, accessTokenSecretKey);
      return NextResponse.json({ isValid: true });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.log("Access token недействителен");
    }
  }

  // Проверка refresh token и попытка обновления
  if (refreshToken) {
    try {
      await jwtVerify(refreshToken, refreshTokenSecretKey);

      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refreshToken: refreshToken }),
      });

      if (!res.ok) throw new Error("Не удалось обновить токен");

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await res.json();

      const response = NextResponse.json({ isValid: true });

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.log("Refresh token тоже недействителен");
      const cookieStore = await cookies();

      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
    }
  }

  return NextResponse.json({ isValid: false });
}
