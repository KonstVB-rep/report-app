"use server";

import { handleError } from "@/shared/api/handleError";
import { DepartmentInfo } from "../types";
import prisma from "@/prisma/prisma-client";


export const getDepartmentsWithUsers = async (): Promise<
DepartmentInfo[]
> => {
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
