"use server";

import { PermissionEnum, Role } from "@prisma/client";

import { cookies } from "next/headers";

import { jwtVerify } from "jose";

import prisma from "@/prisma/prisma-client";

const accessTokenSecretKey = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
);

export const getRole = async (userId: string): Promise<Role> => {
  const userDataRole = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!userDataRole) {
    throw new Error(`Пользователь с id=${userId} не найден`);
  }

  return userDataRole.role;
};

const recoderTokens = async () => {
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

  return payload;
};

export const checkRole = async (role: Role = Role.ADMIN): Promise<boolean> => {
  try {
    const payload = await recoderTokens();

    if (!payload) {
      return false;
    }

    const userRole = await getRole(String(payload.userId));

    return userRole === role;
  } catch (error) {
    console.error("Ошибка при проверке прав доступа:", error);
    return false;
  }
};

export const checkDepartment = async (depId: number): Promise<boolean> => {
  try {
    const payload = await recoderTokens();

    if (!payload) {
      return false;
    }
    const userRole = await getRole(String(payload.userId));
    const userData = await prisma.user.findUnique({
      where: { id: String(payload.userId) },
      select: { id: true, departmentId: true },
    });

    if (userRole === Role.ADMIN) {
      return true;
    }

    return userData?.departmentId === depId;
  } catch (error) {
    console.error("Ошибка при проверке прав доступа:", error);
    return false;
  }
};

export const checkPermission = async (
  permission: PermissionEnum
): Promise<boolean> => {
  try {
    const payload = await recoderTokens();

    if (!payload) {
      return false;
    }

    const userRole = await getRole(String(payload.userId));
    const userPermissions = await prisma.userPermission.findMany({
      where: { id: String(payload.userId) },
      include: { permission: true },
    });
    if (userRole === Role.ADMIN) {
      return true;
    }

    return userPermissions.some((p) => p.permission.name === permission);
  } catch (error) {
    console.error("Ошибка при проверке прав доступа:", error);
    return false;
  }
};
