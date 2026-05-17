"use server"

import { cache } from "react"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import { prisma } from "@/prisma/prisma-client"
import { type PayloadType, verifyToken } from "./session"

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

export const getUserFromCookie = cache(async (): Promise<PayloadType | null> => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const refreshToken = cookieStore.get("refreshToken")?.value

  let payload: PayloadType | null = null

  if (accessToken) {
    try {
      const { payload: verified } = await jwtVerify(accessToken, ACCESS_SECRET)
      payload = verified as unknown as PayloadType
    } catch (_e) {}
  }

  if (!payload && refreshToken) {
    try {
      const userData = await verifyToken(refreshToken, "refresh")
      if (userData) payload = userData
    } catch (_e) {}
  }
  if (payload?.userId) {
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { isBlocked: true },
    })

    if (!dbUser || dbUser.isBlocked) {
      console.log(`[AUTH] Доступ для пользователя ${payload.userId} заблокирован СУБД.`)
      return null
    }

    return payload
  }

  return null
})
