import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { verifyToken } from "@/middleware";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    if (!accessToken) throw new Error("No token");

    // Пытаемся верифицировать токен
    const payload = await verifyToken(accessToken);

    // Возвращаем ответ с полезной информацией
    return NextResponse.json({ isValid: true, payload });
  } catch (error) {
    console.error("Ошибка валидации токена:", error);
    return NextResponse.json({
      isValid: false,
      error: (error as Error).message,
    });
  }
}
