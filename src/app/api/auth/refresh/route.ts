import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Используем jose вместо jsonwebtoken
import { generateTokens } from "@/feature/auth/lib/generateTokens";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Получаем refresh token из cookies
    const { refresh_token: refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ error: "Нет refresh token" }, { status: 401 });
    }

    // Проверяем refresh token с использованием jose
    const secretKey = new TextEncoder().encode(process.env.REFRESH_SECRET_KEY);
    const { payload } = await jwtVerify(refreshToken, secretKey); // Верификация токена

    if (!payload) {
      return NextResponse.json(
        { error: "Неверный refresh token" },
        { status: 401 }
      );
    }

    // Генерируем новые токены
    const { accessToken } = await generateTokens(payload.userId as string);

    // Возвращаем новый access token
    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    return NextResponse.json(
      { error: "Ошибка обновления токена" },
      { status: 500 }
    );
  }
}
