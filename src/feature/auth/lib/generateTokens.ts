import { cookies } from "next/headers";

import { SignJWT } from "jose";

if (!process.env.JWT_SECRET_KEY || !process.env.REFRESH_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY or REFRESH_SECRET_KEY is not defined");
}

if (!process.env.NODE_ENV) {
  throw new Error("NEXT_PUBLIC_NODE_ENV is not defined");
}

export const generateTokens = async (
  userId: string,
  departmentId: string | number
) => {
  // Генерация access token
  const accessToken = await new SignJWT({ userId, departmentId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d") // 1 день
    .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY)); // Подпись токена с секретом

  // Генерация refresh token
  const refreshToken = await new SignJWT({ userId, departmentId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(process.env.REFRESH_SECRET_KEY)); // Подпись токена с секретом

  const cookiesStore = await cookies();

  cookiesStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60,
  });
  cookiesStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60,
  });

  return { accessToken, refreshToken };
};
