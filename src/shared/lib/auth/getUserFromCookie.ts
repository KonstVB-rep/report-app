"use server"

import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { type PayloadType, verifyToken } from "./session"

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

export const getUserFromCookie = async (): Promise<PayloadType | null> => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, ACCESS_SECRET)
      return payload as unknown as PayloadType
    } catch (_e) {}
  }

  if (refreshToken) {
    try {
      const userData = await verifyToken(refreshToken, "refresh")
      if (userData) return userData
    } catch (_e) {}
  }

  return null
}
