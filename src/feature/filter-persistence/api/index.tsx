"use server"

import type { UserFilter } from "@prisma/client"
import { requireUser } from "@/app/api/utils/requireAuth "
import { prisma } from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import type { DeleteFilterReturnType, SaveFilterType, UpdateFilterDataType } from "../types"

export const getUserFilters = async () => {
  try {
    const { userId } = await requireUser()

    const filters = await prisma.userFilter.findMany({
      where: { userId },
    })

    return filters
  } catch (error) {
    console.error("Ошибка в getUserFilters:", error)
    return handleError((error as Error).message || "Произошла ошибка")
  }
}

export const getUserFilterById = async (filterId: string) => {
  try {
    const { userId } = await requireUser()

    const filter = await prisma.userFilter.findUnique({
      where: { userId, id: filterId },
    })

    return filter
  } catch (error) {
    console.error("Ошибка в getUserFilters:", error)
    return handleError((error as Error).message || "Произошла ошибка")
  }
}

export const saveFilter = async (savedData: SaveFilterType): Promise<UserFilter> => {
  try {
    const { userId } = await requireUser()

    const { data } = savedData

    const existingFilter = await prisma.userFilter.findUnique({
      where: { id: userId, filterName: data.filterName },
    })

    if (existingFilter) {
      return handleError("Фильтр уже существует")
    }

    const newFilter = await prisma.userFilter.create({
      data: {
        ...data,
        userId: userId,
      },
    })

    return newFilter
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const deleteFilter = async (data: { id: string }): Promise<DeleteFilterReturnType> => {
  try {
    await requireUser()

    const { id } = data

    const filter = await prisma.userFilter.findUnique({
      where: { id },
    })

    if (!filter) {
      return handleError("Фильтр не найден")
    }

    await prisma.userFilter.delete({
      where: { id },
    })

    return { data: null, message: "Фильтр успешно удален", error: false }
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const updateFilter = async (data: UpdateFilterDataType): Promise<UserFilter | undefined> => {
  try {
    await requireUser()

    const filter = await prisma.userFilter.findUnique({
      where: { id: data.id },
    })

    if (!filter) {
      return handleError("Фильтр не найден")
    }

    const updatedFilter = await prisma.userFilter.update({
      where: { id: data.id },
      data,
    })

    return updatedFilter
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const selectFilter = async (id: string) => {
  try {
    const { userId } = await requireUser()

    const filter = await prisma.userFilter.findUnique({
      where: { id },
    })

    if (!filter) {
      return handleError("Фильтр не найден")
    }

    if (filter.userId !== userId) {
      return handleError("Недостаточно прав")
    }

    await prisma.userFilter.updateMany({
      where: { userId },
      data: { isActive: false },
    })

    await prisma.userFilter.update({
      where: { id },
      data: { isActive: true },
    })

    return { success: true, message: "Фильтр успешно выбран" }
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const disableSavedFilters = async () => {
  try {
    const { userId } = await requireUser()

    await prisma.userFilter.updateMany({
      where: { userId },
      data: { isActive: false },
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}
