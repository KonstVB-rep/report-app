"use server"

import { errors, jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { RoleValue } from "@/entities/user/model/objectTypes"
import type { PERMISSIONS_UNION } from "@/shared/lib/constants"

export type PayloadType = {
  userId: string
  departmentId: number
  role: RoleValue
  username: string
  position: string
  permissions: PERMISSIONS_UNION[]
  isBlocked: boolean
}

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY)
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_SECRET_KEY)

const ACCESS_TIME_SEC = 60 * 60
const REFRESH_TIME_SEC = 60 * 60 * 24 * 30

export const generateTokensAndSetCookies = async (payload: PayloadType) => {
  const [accessToken, refreshToken] = await Promise.all([
    new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(ACCESS_SECRET),
    new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(REFRESH_SECRET),
  ])

  const cookieStore = await cookies()
  const commonOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  }

  cookieStore.set("accessToken", accessToken, {
    ...commonOptions,
    maxAge: ACCESS_TIME_SEC,
  })
  cookieStore.set("refreshToken", refreshToken, {
    ...commonOptions,
    maxAge: REFRESH_TIME_SEC,
  })

  return { accessToken, refreshToken }
}

/**
 * Универсальная проверка токенов
 * @param token - строка токена
 * @param type - 'access' или 'refresh' (определяет секрет для проверки)
 */
export const verifyToken = async (
  token: string,
  type: "access" | "refresh",
): Promise<PayloadType | null> => {
  try {
    const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET

    const { payload } = await jwtVerify(token, secret)

    return payload as unknown as PayloadType
  } catch (error: unknown) {
    if (error instanceof errors.JWTExpired) {
      return null
    }

    console.error(
      `Ошибка валидации ${type} токена:`,
      error instanceof Error ? error.message : error,
    )
    return null
  }
}
