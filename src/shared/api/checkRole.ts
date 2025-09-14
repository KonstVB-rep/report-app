// actions/checkRole.ts
"use server";

import { Role } from "@prisma/client";

import { cookies } from "next/headers";

import { jwtVerify } from "jose";

import prisma from "@/prisma/prisma-client";

// actions/checkRole.ts

// actions/checkRole.ts

// actions/checkRole.ts

// actions/checkRole.ts

// ← Импортируем cookies

const accessTokenSecretKey = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
);

export const checkRole = async (role: Role = Role.ADMIN): Promise<boolean> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      console.log("Токен отсутствует");
      return false;
    }

    const { payload } = await jwtVerify(accessToken, accessTokenSecretKey);

    if (!payload.userId) {
      return false;
    }

    const userData = await prisma.user.findUnique({
      where: { id: String(payload.userId) },
      select: { id: true, role: true },
    });

    return userData?.role === role;
  } catch (error) {
    console.error("Ошибка при проверке прав доступа:", error);
    return false;
  }
};
