import { jwtVerify } from "jose"
import { type NextRequest, NextResponse } from "next/server"
import { generateTokensAndSetCookies, type PayloadType } from "@/shared/lib/auth/session"

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type")

    if (contentType !== "application/json") {
      return NextResponse.json({ error: "Неверный Content-Type" }, { status: 400 })
    }

    const body = await req.json().catch(() => null)

    if (!body || !body.refreshToken) {
      return NextResponse.json({ error: "Refresh token отсутствует" }, { status: 400 })
    }
    const { refreshToken } = body

    const secretKey = new TextEncoder().encode(process.env.REFRESH_SECRET_KEY)
    const { payload: rawPayload } = await jwtVerify(refreshToken, secretKey)

    if (!rawPayload || !rawPayload.userId || rawPayload.departmentId === undefined) {
      return NextResponse.json({ error: "Некорректные данные в токене" }, { status: 401 })
    }

    const payload = rawPayload as unknown as PayloadType
    const { userId, departmentId, role, username, position, permissions } = payload

    const tokens = await generateTokensAndSetCookies({
      userId,
      departmentId,
      role,
      username,
      position,
      permissions,
    })

    if (!tokens) throw new Error("Token generation failed")

    return NextResponse.json(
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        userId,
        departmentId,
        role,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Auth Refresh Error:", error)

    const err = error as Error

    const isAuthError = ["JWTExpired", "JWSSignatureVerificationFailed", "JWTInvalid"].includes(
      err.name,
    )

    if (isAuthError) {
      return NextResponse.json(
        {
          error: err.name === "JWTExpired" ? "Сессия истекла" : "Невалидный токен",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
