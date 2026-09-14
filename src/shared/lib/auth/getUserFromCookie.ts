"use server"

import { cache } from "react"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { RoleValue } from "@/entities/user/model/objectTypes"
import { prisma } from "@/prisma/prisma-client"
import type { PERMISSIONS_UNION } from "../constants"
import { type PayloadType, verifyToken } from "./session"

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

const getCachedUser = cache(async (userId: string): Promise<PayloadType | null> => {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      departmentId: true,
      role: true,
      username: true,
      position: true,
      isBlocked: true,
      permissions: {
        select: {
          permission: {
            select: { name: true },
          },
        },
      },
    },
  })

  if (!dbUser || dbUser.isBlocked) {
    console.log(`[AUTH] Доступ для пользователя ${userId} заблокирован СУБД.`)
    return null
  }

  return {
    userId: dbUser.id,
    departmentId: dbUser.departmentId,
    role: dbUser.role as RoleValue,
    username: dbUser.username,
    position: dbUser.position,
    isBlocked: dbUser.isBlocked,
    permissions: dbUser.permissions.map((up) => up.permission.name as PERMISSIONS_UNION),
  }
})

export const getUserFromCookie = async (): Promise<PayloadType | null> => {
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
    return getCachedUser(payload.userId)
  }

  return payload
}
