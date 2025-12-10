// "use server"

// import bcrypt from "bcrypt"
// import { generateTokens } from "@/feature/auth/lib/generateTokens"
// import { prisma } from "@/prisma/prisma-client"

// export const login = async (_: unknown, formData: FormData) => {
//   try {
//     const user_password = formData.get("user_password") as string
//     const email = formData.get("email") as string

//     if (!email || !user_password) {
//       return {
//         data: null,
//         message: "Все поля обязательны для заполнения",
//         error: true,
//         code: "MISSING_FIELDS",
//       }
//     }

//     const user = await prisma.user.findUnique({
//       where: { email },
//       include: {
//         permissions: { select: { permission: true } },
//         telegramInfo: { select: { tgUserId: true, tgUserName: true } },
//       },
//     })

//     if (!user) {
//       return {
//         data: null,
//         message: "Пользователь не найден",
//         error: true,
//         code: "USER_NOT_FOUND",
//       }
//     }

//     if (!user.user_password) {
//       return {
//         data: null,
//         message: "Пароль не установлен",
//         error: true,
//         code: "PASSWORD_NOT_SET",
//       }
//     }

//     const isPasswordValid = await bcrypt.compare(user_password, user.user_password)
//     if (!isPasswordValid) {
//       return {
//         data: null,
//         message: "Неверный пароль",
//         error: true,
//         code: "INVALID_CREDENTIALS",
//       }
//     }

//     const lastLoginDate = await prisma.userLogin.findFirst({
//       where: { userId: user.id },
//       orderBy: { loginAt: "desc" },
//     })
//     await prisma.userLogin.upsert({
//       where: { id: lastLoginDate?.id ?? "-1" },
//       update: { loginAt: new Date() },
//       create: { userId: user.id, loginAt: new Date() },
//     })

//     await generateTokens(user.id, user.departmentId)

//     const { user_password: _password, ...userWithoutPassword } = user

//     return {
//       data: {
//         ...userWithoutPassword,
//         permissions: user.permissions.map((p) => p.permission.name),
//         lastlogin: lastLoginDate?.loginAt ?? null,
//       },
//       message: "Авторизация успешна",
//       error: false,
//     }
//   } catch (error) {
//     console.error("Ошибка входа:", {
//       message: (error as Error).message,
//       stack: (error as Error).stack,
//     })
//     return {
//       data: null,
//       message: "Внутренняя ошибка сервера",
//       error: true,
//       code: "SERVER_ERROR",
//     }
//   }
// }
"use server"

import bcrypt from "bcrypt"
import { generateTokens } from "@/feature/auth/lib/generateTokens"
import { prisma } from "@/prisma/prisma-client"

export const login = async (_: unknown, formData: FormData) => {
  try {
    const user_password = formData.get("user_password") as string
    const email = formData.get("email") as string

    // 1. Простая валидация
    if (!email || !user_password) {
      return {
        data: null,
        message: "Все поля обязательны для заполнения",
        error: true,
        code: "MISSING_FIELDS",
      }
    }

    // 2. Ищем пользователя
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        permissions: { select: { permission: { select: { name: true } } } }, // Оптимизация выборки
        telegramInfo: { select: { tgUserId: true, tgUserName: true } },
      },
    })

    // 3. Безопасная проверка (чтобы не выдавать существование email)
    // Если пользователя нет, мы всё равно не выходим сразу, чтобы время ответа было похожим (в идеале),
    // но для внутренних CRM достаточно просто вернуть общую ошибку.
    if (!user || !user.user_password) {
      return {
        data: null,
        message: "Неверный email или пароль", // Общее сообщение
        error: true,
        code: "INVALID_CREDENTIALS",
      }
    }

    // 4. Сверка пароля
    const isPasswordValid = await bcrypt.compare(user_password, user.user_password)

    if (!isPasswordValid) {
      return {
        data: null,
        message: "Неверный email или пароль",
        error: true,
        code: "INVALID_CREDENTIALS",
      }
    }

    // 5. Логирование входа (ИСПРАВЛЕНО)
    // Вариант А: Сохраняем историю (создаем новую запись каждый раз)
    await prisma.userLogin.create({
      data: {
        userId: user.id,
        loginAt: new Date(),
      },
    })

    // 6. Генерация токенов (Cookies)
    await generateTokens(user.id, user.departmentId)

    // 7. Подготовка данных для клиента
    // Удаляем пароль из объекта
    const { user_password: _password, ...userWithoutPassword } = user

    // Получаем последнюю дату входа (текущую)
    const currentLoginDate = new Date()

    return {
      data: {
        ...userWithoutPassword,
        // Упрощаем массив прав сразу в массив строк
        permissions: user.permissions.map((p) => p.permission.name),
        // lastlogin: currentLoginDate,
      },
      message: "Авторизация успешна",
      error: false,
    }
  } catch (error) {
    console.error("Ошибка входа:", {
      message: (error as Error).message,
      // stack лучше не логировать в продакшене, если логи доступны посторонним, но для дебага ок
    })
    return {
      data: null,
      message: "Внутренняя ошибка сервера",
      error: true,
      code: "SERVER_ERROR",
    }
  }
}
