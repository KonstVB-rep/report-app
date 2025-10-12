"use server"

import prisma from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import type { DepartmentInfo } from "../types"

export const getDepartmentsWithUsers = async (): Promise<DepartmentInfo[]> => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        users: {
          where: {
            position: {
              not: "руководитель организации",
            },
          },
        },
      },
    })

    return (departments as DepartmentInfo[]) || []
  } catch (error) {
    console.error("Ошибка при получении отделов:", error)
    return handleError("Ошибка при получении отделов")
  }
}
