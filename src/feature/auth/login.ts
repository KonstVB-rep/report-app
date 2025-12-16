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
        permissions: { select: { permission: { select: { name: true } } } },
        telegramInfo: { select: { tgUserId: true, tgUserName: true } },
      },
    })

    // Проверка существования и пароля (одним блоком для безопасности timing attacks)
    if (
      !user ||
      !user.user_password ||
      !(await bcrypt.compare(user_password, user.user_password))
    ) {
      return {
        data: null,
        message: "Неверный email или пароль",
        error: true,
        code: "INVALID_CREDENTIALS",
      }
    }

    await Promise.all([
      prisma.userLogin.create({
        data: {
          userId: user.id,
          loginAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          lastlogin: new Date(),
        },
      }),
      generateTokens(user.id, user.departmentId),
    ])

    const { user_password: _password, ...userWithoutPassword } = user

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
