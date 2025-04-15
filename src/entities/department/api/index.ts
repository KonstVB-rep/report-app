"use server";

import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";

import { DepartmentInfo } from "../types";

export const getDepartmentsWithUsers = async (): Promise<DepartmentInfo[]> => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        users: true,
      },
    });

    return departments as DepartmentInfo[];
  } catch (error) {
    console.error("Ошибка при получении отделов:", error);
    return handleError("Ошибка при получении отделов");
  }
};

export const getDepartments = async (): Promise<DepartmentInfo[]> => {
  try {
    const departments = await prisma.department.findMany();
    return departments as DepartmentInfo[];
  } catch (error) {
    console.error("Ошибка при получении отделов:", error);
    return handleError("Ошибка при получении отделов");
  }
};
