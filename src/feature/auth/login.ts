"use server";

import bcrypt from "bcrypt";

import { generateTokens } from "@/feature/auth/lib/generateTokens";
import prisma from "@/prisma/prisma-client";

export const login = async (prevState: unknown, formData: FormData) => {
  try {
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    if (!email || !password) {
      return {
        data: null,
        message: "Пожалуйста, заполните все поля",
        error: true,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        permissions: {
          select: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      return {
        data: null,
        message: "Пользователь не найден",
        error: true,
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.user_password);

    if (!isPasswordValid) {
      return {
        data: null,
        message: "Неверные данные авторизации",
        error: true,
      };
    }

    const lastLoginDate = await prisma.userLogin.findFirst({
      where: { userId: user.id },
      orderBy: { loginAt: "desc" },
    });

    if (!lastLoginDate) {
      // Если записи нет, создаем новую
      await prisma.userLogin.create({
        data: {
          userId: user.id,
          loginAt: new Date(),
        },
      });
    } else {
      // Если запись уже есть, обновляем `loginAt`
      await prisma.userLogin.update({
        where: { id: lastLoginDate.id },
        data: { loginAt: new Date() },
      });
    }

    await generateTokens(user.id, user.departmentId);

    return {
      data: {
        ...user,
        permissions: user.permissions.map((p) => p.permission.name),
        lastlogin: lastLoginDate?.loginAt,
      },
      message: "Авторизация прошла успешно",
    };
  } catch (error) {
    console.log(error, "error");
    return {
      message: "Ошибка авторизации",
      error: true,
    };
  }
};
