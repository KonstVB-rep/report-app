"use server";

import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";

import { DepartmentInfo, DepartmentWithUsersAndTasks } from "../types";

export const getDepartmentsWithUsers = async (): Promise<DepartmentInfo[]> => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        users: true,
      },
    });

    return (departments as DepartmentInfo[]) || [];
  } catch (error) {
    console.error("Ошибка при получении отделов:", error);
    return handleError("Ошибка при получении отделов");
  }
};

export const getDepartmentWithUsersAndTasks = async (
  departmentId: string
): Promise<DepartmentWithUsersAndTasks | null> => {
  try {
    const department = await prisma.department.findUnique({
      where: { id: +departmentId },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            position: true,
            tasks: true, 
          },
        },
      },
    });

    return department ? (department as DepartmentWithUsersAndTasks) : null;
  } catch (error) {
    console.error("Ошибка при получении отдела:", error);
    return handleError("Ошибка при получении отдела");
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
