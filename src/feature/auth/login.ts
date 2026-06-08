"use server"

import bcrypt from "bcrypt"
import { prisma } from "@/prisma/prisma-client"
import { generateTokensAndSetCookies, type PayloadType } from "@/shared/lib/auth/session"

export const login = async (_: unknown, formData: FormData) => {
  try {
    const user_password = formData.get("user_password") as string
    const email = formData.get("email") as string

    if (!email || !user_password) {
      return {
        data: null,
        message: "Все поля обязательны для заполнения",
        error: true,
        code: "MISSING_FIELDS",
      }
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        departmentId: true,
        role: true,
        username: true,
        position: true,
        user_password: true,
        lastlogin: true,
        email: true,
        phone: true,
        isBlocked: true,
        permissions: { select: { permission: { select: { name: true } } } },
        telegramInfo: { select: { tgUserId: true, tgUserName: true } },
      },
    })

    if (!user?.user_password || !(await bcrypt.compare(user_password, user.user_password))) {
      return {
        data: null,
        message: "Неверный email или пароль",
        error: true,
        code: "INVALID_CREDENTIALS",
      }
    }

    const { user_password: _password, ...userWithoutPassword } = user

    const permissions = user.permissions.map((p) => p.permission.name)
    const payload: PayloadType = {
      userId: user.id,
      departmentId: user.departmentId,
      role: user.role,
      username: user.username,
      position: user.position,
      permissions,
      isBlocked: user.isBlocked,
    }

    await Promise.all([
      prisma.userLogin.create({
        data: { userId: user.id, loginAt: new Date() },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { lastlogin: new Date() },
      }),
      generateTokensAndSetCookies(payload),
    ])

    return {
      data: {
        ...userWithoutPassword,
        permissions: user.permissions.map((p) => p.permission.name),
      },
      message: "Авторизация успешна",
      error: false,
    }
  } catch (error) {
    console.error("Ошибка входа:", {
      message: (error as Error).message,
    })
    return {
      data: null,
      message: "Внутренняя ошибка сервера",
      error: true,
      code: "SERVER_ERROR",
    }
  }
}
