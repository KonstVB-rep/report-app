"use server"

import bcrypt from "bcrypt"
import { generateTokens } from "@/feature/auth/lib/generateTokens"
import { prisma } from "@/prisma/prisma-client"

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
      include: {
        permissions: { select: { permission: true } },
        telegramInfo: { select: { tgUserId: true, tgUserName: true } },
      },
    })

    if (!user) {
      return {
        data: null,
        message: "Пользователь не найден",
        error: true,
        code: "USER_NOT_FOUND",
      }
    }

    if (!user.user_password) {
      return {
        data: null,
        message: "Пароль не установлен",
        error: true,
        code: "PASSWORD_NOT_SET",
      }
    }

    const isPasswordValid = await bcrypt.compare(user_password, user.user_password)
    if (!isPasswordValid) {
      return {
        data: null,
        message: "Неверный пароль",
        error: true,
        code: "INVALID_CREDENTIALS",
      }
    }

    const lastLoginDate = await prisma.userLogin.findFirst({
      where: { userId: user.id },
      orderBy: { loginAt: "desc" },
    })
    await prisma.userLogin.upsert({
      where: { id: lastLoginDate?.id ?? "-1" },
      update: { loginAt: new Date() },
      create: { userId: user.id, loginAt: new Date() },
    })

    await generateTokens(user.id, user.departmentId)

    const { user_password: _password, ...userWithoutPassword } = user

    return {
      data: {
        ...userWithoutPassword,
        permissions: user.permissions.map((p) => p.permission.name),
        lastlogin: lastLoginDate?.loginAt ?? null,
      },
      message: "Авторизация успешна",
      error: false,
    }
  } catch (error) {
    console.error("Ошибка входа:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    })
    return {
      data: null,
      message: "Внутренняя ошибка сервера",
      error: true,
      code: "SERVER_ERROR",
    }
  }
}
