import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { generateTokens } from "@/feature/auth/lib/generateTokens";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type");

    if (contentType !== "application/json") {
      return NextResponse.json(
        { error: "Неверный Content-Type" },
        { status: 400 },
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || !body.refreshToken) {
      return NextResponse.json(
        { error: "Refresh token отсутствует" },
        { status: 400 },
      );
    }
    const { refreshToken } = body;

    const secretKey = new TextEncoder().encode(process.env.REFRESH_SECRET_KEY);
    const { payload } = await jwtVerify(refreshToken, secretKey);

    if (!payload?.userId || !payload?.departmentId) {
      return NextResponse.json(
        { error: "Некорректные данные в токене" },
        { status: 401 },
      );
    }

    const tokens = await generateTokens(
      payload.userId as string,
      payload.departmentId as string | number,
    );

    if (!tokens) throw new Error("Token generation failed");

    return NextResponse.json(
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId: payload.userId,
        departmentId: payload.departmentId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Auth Refresh Error:", error);

    const err = error as Error;

    const isAuthError = [
      "JWTExpired",
      "JWSSignatureVerificationFailed",
      "JWTInvalid",
    ].includes(err.name);

    if (isAuthError) {
      return NextResponse.json(
        {
          error:
            err.name === "JWTExpired" ? "Сессия истекла" : "Невалидный токен",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
