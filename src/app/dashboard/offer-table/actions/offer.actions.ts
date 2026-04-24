"use server"

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole"
import { requireUser } from "@/app/api/utils/requireAuth "
import { prisma } from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import { PermissionEnum, EquipmentItem } from "@prisma/client"
import { Equipment, EquipmentDb } from "../lib/types"
// import { toDec } from "@/shared/lib/utils";

export const getEquipments = async (): Promise<Equipment[]> => {
  try {
    await requireUser()
    const items = await prisma.equipmentItem.findMany()
    return items.map((item) => ({
      ...item,
      price: item.price.toString(),
    }))
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const addEquipment = async (item: EquipmentItem): Promise<void> => {
  try {
    await requireUser()
    await prisma.equipmentItem.create({
      data: {
        ...item,
        price: item.price,
      },
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const deleteEquipmentList = async (ids: string[]): Promise<void> => {
  try {
    const user = await requireUser()

    await checkUserPermissionByRole(user, [PermissionEnum.EQUIPMENT_DELETE])

    await prisma.equipmentItem.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const updateEquipmentsList = async (items: Partial<EquipmentDb>[]) => {
  try {
    const user = await requireUser()

    await checkUserPermissionByRole(user, [PermissionEnum.EQUIPMENT_MANAGEMENT])

    const ids = items.map((i) => String(i.id))

    // Находим все существующие ID в базе
    const existingItems = await prisma.equipmentItem.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    })

    const existingIds = new Set(existingItems.map((i) => i.id))

    // Фильтруем только те, что реально есть в базе
    const validUpdates = items.filter((item) => existingIds.has(String(item.id)))

    if (validUpdates.length === 0) return []

    return await prisma.$transaction(
      validUpdates.map((item) => {
        const { id, ...payload } = item
        return prisma.equipmentItem.update({
          where: { id: String(id) },
          data: payload,
        })
      }),
    )
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}
