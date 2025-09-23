import { NextResponse } from "next/server";

import { jwtVerify } from "jose";

import { generateTokens } from "@/feature/auth/lib/generateTokens";

export async function POST(req: Request) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const contentType = req.headers.get("content-type");
    if (contentType !== "application/json") {
      return NextResponse.json(
        { error: "Неверный Content-Type, ожидается application/json" },
        { status: 400, headers }
      );
    }

    const { refreshToken: refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Нет refresh token" },
        { status: 401, headers }
      );
    }

    const secretKey = new TextEncoder().encode(process.env.REFRESH_SECRET_KEY);

    try {
      const { payload } = await jwtVerify(refreshToken, secretKey);

      if (!payload?.userId || !payload?.departmentId) {
        return NextResponse.json(
          { error: "Неверный refresh token: отсутствуют необходимые данные" },
          { status: 401, headers }
        );
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateTokens(
          payload.userId as string,
          payload.departmentId as string | number
        );

      return NextResponse.json(
        {
          accessToken,
          refreshToken: newRefreshToken,
          userId: payload.userId,
          departmentId: payload.departmentId,
        },
        { status: 200, headers }
      );
    } catch (error) {
      console.error("Ошибка верификации refresh token:", error);

      if ((error as Error).name === "JWTExpired") {
        return NextResponse.json(
          { error: "Refresh token истек" },
          { status: 401, headers }
        );
      }

      return NextResponse.json(
        { error: "Ошибка обновления токена" },
        { status: 500, headers }
      );
    }
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    return NextResponse.json(
      {
        error: "Внутренняя ошибка сервера",
        details: (error as Error).message,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
