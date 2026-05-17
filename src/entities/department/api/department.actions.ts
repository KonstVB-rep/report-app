"use server"

import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import type { DepartmentInfo } from "../types"

export const getCachedDepartmentsWithUsers = async (): Promise<DepartmentInfo[]> => {
  "use cache"
  cacheLife("days")
  cacheTag("departments-global-list")

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
}

export const getDepartmentsWithUsers = async (): Promise<DepartmentInfo[]> => {
  try {
    return await getCachedDepartmentsWithUsers()
  } catch (error) {
    console.error("Ошибка при получении отделов:", error)
    return handleError("Ошибка при получении отделов")
  }
}
