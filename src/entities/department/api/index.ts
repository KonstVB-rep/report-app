'use server'

import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/db/prisma-client";
import { handleError } from "@/shared/api/handleError";
import { NextResponse } from "next/server";
import { DepartmentTypeSidebar } from "../types";
import { DepartmentsTitle } from "@/entities/user/model/objectTypes";


// export const getDepatments = async () => {
//   try {
//     const { error, message, data } = await handleAuthorization();
//     if (error) return { error, message, data: null };

//     const departments = await prisma.department.findMany();

//     return NextResponse.json(departments);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
//   }
// }



export const getDepartmentsWithPersons = async ():Promise<DepartmentTypeSidebar[]>  => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
            position: true,
            role: true,
            departmentId: true,
          },
        },
      },
    });

    return departments as DepartmentTypeSidebar[]
  } catch (error) {
    console.error("Ошибка при получении отделов:", error);
    return handleError("Ошибка при получении отделов");
  }
};



export const getDepatments = async () => {
  try {
    await handleAuthorization();
  
    const departments = await prisma.department.findMany();

    return NextResponse.json(departments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export const getDepartmentName = async (id: number) => {
  try {
    await handleAuthorization();
  
    const department = await prisma.department.findUnique({
      where: {
        id: +id
      },
    });

    if (!department) {
      return "Отдел не найден";
    }

    return DepartmentsTitle[department.name];
  } catch (error) {
    console.error(error);
    const errorMessage =
      typeof error === "string"
        ? error
        :  "Ошибка при создании проекта";
    handleError(errorMessage);
  }
}