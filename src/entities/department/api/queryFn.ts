"use server";

import { TOAST } from "@/entities/user/ui/Toast";
import { getDepartmentsWithUsers } from ".";
import { Prisma } from "@prisma/client";

export const getDepartmentsWithUsersQuery = async () => {
  try {
    return await getDepartmentsWithUsers();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma ошибка:', error.code);
      TOAST.ERROR("Ошибка cхемы Prisma");
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Ошибка валидации:', error.message);
      TOAST.ERROR("Ошибка валидации");
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('Ошибка подключения:', error.message);
      TOAST.ERROR("Ошибка подключения");
    } else {
      console.error('Другая ошибка:', (error as Error).message);
      TOAST.ERROR((error as Error).message);
    }
    throw error;
  }
};
