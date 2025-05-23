"use server";

import { Prisma } from "@prisma/client";

import { TOAST } from "@/shared/ui/Toast";

import { getDepartmentsWithUsers, getDepartmentWithUsersAndTasks } from ".";

export const getDepartmentsWithUsersQuery = async () => {
  try {
    return await getDepartmentsWithUsers();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma ошибка:", error.code);
      TOAST.ERROR("Ошибка cхемы Prisma");
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      console.error("Ошибка валидации:", error.message);
      TOAST.ERROR("Ошибка валидации");
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("Ошибка подключения:", error.message);
      TOAST.ERROR("Ошибка подключения");
    } else {
      console.error("Другая ошибка:", (error as Error).message);
      TOAST.ERROR((error as Error).message);
    }
    throw error;
  }
};


export const getDepartmentWithUsersAndTasksQuery = async (departmentId: string) => {
  try {
    return await getDepartmentWithUsersAndTasks(departmentId);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma ошибка:", error.code);
      TOAST.ERROR("Ошибка cхемы Prisma");
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      console.error("Ошибка валидации:", error.message);
      TOAST.ERROR("Ошибка валидации");
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("Ошибка подключения:", error.message);
      TOAST.ERROR("Ошибка подключения");
    } else {
      console.error("Другая ошибка:", (error as Error).message);
      TOAST.ERROR((error as Error).message);
    }
    throw error;
  }
};
