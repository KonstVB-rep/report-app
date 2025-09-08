import { cookies } from "next/headers";

import { SignJWT } from "jose";

export const generateTokens = async (
  userId: string,
  departmentId: string | number
) => {

  const [accessToken, refreshToken] = await Promise.all([
    new SignJWT({ userId, departmentId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY)),

    new SignJWT({ userId, departmentId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(new TextEncoder().encode(process.env.REFRESH_SECRET_KEY)),
  ]);

  const cookiesStore = await cookies();

  cookiesStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });
  cookiesStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { accessToken, refreshToken };
};
