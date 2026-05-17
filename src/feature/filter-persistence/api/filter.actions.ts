"use server"

import { Prisma, type UserFilter } from "@prisma/client"
import { requireUser } from "@/app/api/utils/requireAuth "
import { prisma } from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import type { DeleteFilterReturnType, SaveFilterType, UpdateFilterDataType } from "../types"

export const getUserFilters = async () => {
  try {
    const user = await requireUser()

    return await prisma.userFilter.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Ошибка в getUserFilters:", error)
    return handleError((error as Error).message || "Произошла ошибка")
  }
}

export const getUserFilterById = async (filterId: string) => {
  try {
    const user = await requireUser()

    return await prisma.userFilter.findFirst({
      where: { id: filterId, userId: user.userId },
    })
  } catch (error) {
    console.error("Ошибка в getUserFilters:", error)
    return handleError((error as Error).message || "Произошла ошибка")
  }
}

export const saveFilter = async (savedData: SaveFilterType): Promise<UserFilter> => {
  try {
    const user = await requireUser()
    const { data } = savedData

    return await prisma.userFilter.create({
      data: {
        ...data,
        userId: user.userId,
      },
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return handleError("Фильтр с таким именем уже существует")
    }
    return handleError("Ошибка сохранения фильтра")
  }
}

export const deleteFilter = async (data: { id: string }): Promise<DeleteFilterReturnType> => {
  try {
    const user = await requireUser()

    const { count } = await prisma.userFilter.deleteMany({
      where: {
        id: data.id,
        userId: user.userId,
      },
    })

    if (count === 0) return handleError("Фильтр не найден или нет прав")

    return { data: null, message: "Фильтр успешно удален", error: false }
  } catch (error) {
    console.log(error, "deleteFilter")
    return handleError("Не удалось удалить фильтр")
  }
}

export const updateFilter = async (data: UpdateFilterDataType): Promise<UserFilter | undefined> => {
  try {
    const user = await requireUser()
    const { id, userId, ...updateBody } = data

    const { count } = await prisma.userFilter.updateMany({
      where: {
        id: data.id,
        userId: user.userId,
      },
      data: updateBody,
    })

    if (count === 0) return handleError("Фильтр не найден или нет прав")

    return (await prisma.userFilter.findUnique({
      where: { id: data.id },
    })) as UserFilter
  } catch (error) {
    console.log(error, "updateFilter")
    return handleError("Ошибка обновления")
  }
}

export const selectFilter = async (id: string) => {
  try {
    const user = await requireUser()

    await prisma.$transaction([
      prisma.userFilter.updateMany({
        where: { userId: user.userId },
        data: { isActive: false },
      }),

      prisma.userFilter.updateMany({
        where: { id, userId: user.userId },
        data: { isActive: true },
      }),
    ])

    return { success: true, message: "Фильтр успешно выбран" }
  } catch (error) {
    console.log(error, "selectFilter")
    return handleError("Ошибка при выборе фильтра")
  }
}

export const disableSavedFilters = async () => {
  try {
    const user = await requireUser()

    await prisma.userFilter.updateMany({
      where: { userId: user.userId },
      data: { isActive: false },
    })
    return { success: true }
  } catch (error) {
    console.log(error, "disableSavedFilters")
    return handleError("Ошибка сброса")
  }
}
