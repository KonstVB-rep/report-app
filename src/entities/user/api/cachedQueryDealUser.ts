"use cache"

import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/prisma/prisma-client"

export const tagKeysUserActions = {
  baseUser: (userId: string) => `user-${userId}`,
  usersByDept: (departmentId: number) => `users-dept-${departmentId}`,
  allUsersAdminTable: () => "users-global-admin-table",
} as const

export const getCachedBaseUserData = async (targetUserId: string) => {
  "use cache"
  cacheLife("days")
  cacheTag(tagKeysUserActions.baseUser(targetUserId))
  return await prisma.user.findUnique({
    where: { id: targetUserId },
    include: {
      department: {
        select: { name: true },
      },
      permissions: {
        include: {
          permission: {
            select: { name: true },
          },
        },
      },
    },
  })
}

// export const getCachedUsersByDepartment = async (departmentId: number) => {
//   cacheLife("days")
//   cacheTag(tagKeysUserActions.usersByDept(departmentId))

//   return await prisma.user.findMany({
//     where: { departmentId },
//   })
// }
export const getCachedAllUsersTable = async () => {
  cacheLife("days")
  cacheTag(tagKeysUserActions.allUsersAdminTable())

  console.log("[Cache DB] Тяжелый пересчет списка пользователей для Админки...")

  const [lastLogins, users] = await Promise.all([
    prisma.userLogin.groupBy({
      by: ["userId"],
      _max: { loginAt: true },
    }),
    prisma.user.findMany({
      include: {
        department: { select: { name: true } },
        permissions: {
          include: { permission: { select: { name: true } } },
        },
        telegramInfo: {
          select: { tgUserName: true, tgUserId: true },
        },
      },
    }),
  ])

  return users.map((user) => {
    const lastLoginRecord = lastLogins.find((ll) => ll.userId === user.id)
    const lastLoginDate = lastLoginRecord?._max.loginAt || new Date(0)

    return {
      ...user,
      login: user.username,
      telegramInfo: user.telegramInfo[0]?.tgUserName || "",
      tgUserId: user.telegramInfo[0]?.tgUserId || "",
      lastlogin: lastLoginDate.toISOString(),
      permissions: user.permissions.map((p) => p.permission.name),
    }
  })
}
