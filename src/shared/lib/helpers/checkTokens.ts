"use server";

import { cookies } from "next/headers";

import { jwtVerify } from "jose";

import { AuthError } from "./customErrors";

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

export const refreshTokenRequest = async (refreshToken: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new AuthError("Refresh token expired");
    } else {
      throw new AuthError("Error refreshing tokens");
    }
  }

  return await res.json();
};

const setTokenCookies = async (accessToken: string, refreshToken?: string) => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
};

const refreshTokenAction = async (refreshToken: string) => {
  try {
    if (!refreshToken) {
      throw new AuthError("Refresh token not found");
    }

    const tokens = await refreshTokenRequest(refreshToken);
    await setTokenCookies(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("AuthError:", error.message);
      throw error;
    } else {
      console.error("Unknown error:", error);
      throw new AuthError("Unknown error during token refresh");
    }
  }
};

export const checkTokens = async (): Promise<boolean> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
      throw new AuthError("Нет токенов в cookies");
    }

    if (accessToken) {
      try {
        await verifyToken(accessToken);
        return true;
      } catch (err) {
        console.log("Access token недействителен", err);
      }
    }

    if (refreshToken) {
      const newAccessToken = await refreshTokenAction(refreshToken);
      await verifyToken(newAccessToken);
      return true;
    }

    throw new AuthError("Не удалось проверить токены");
  } catch (error) {
    console.error("Ошибка проверки токенов:", error);
    throw error;
  }
};
