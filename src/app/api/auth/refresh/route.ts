import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Используем jose вместо jsonwebtoken
import { generateTokens } from "@/feature/auth/lib/generateTokens";

export async function POST(req: Request) {
  try {
    const { refresh_token: refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ error: "Нет refresh token" }, { status: 401 });
    }

    const secretKey = new TextEncoder().encode(process.env.REFRESH_SECRET_KEY);

    try {
      const { payload } = await jwtVerify(refreshToken, secretKey);

      if (!payload) {
        return NextResponse.json(
          { error: "Неверный refresh token" },
          { status: 401 }
        );
      }

      const { accessToken } = await generateTokens(
        payload.userId as string,
        payload.deratmentId as string | number
      );

      return NextResponse.json({ accessToken });
    } catch (error) {
      console.error("Ошибка верификации refresh token:", error);

      if ((error as Error).name === "JWTExpired") {
        return NextResponse.json(
          { error: "Refresh token истек" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: "Ошибка обновления токена" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Ошибка обновления токена:", (error as Error).message);
    return NextResponse.json(
      { error: "Ошибка обновления токена" },
      { status: 500 }
    );
  }
}