"use server"

import { PermissionEnum, Prisma } from "@prisma/client"
import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole"
import { requireUser } from "@/app/api/utils/requireAuth "
import { prisma } from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import { toDec } from "@/shared/lib/utils"
import type { EquipmentFormValues } from "../components/AddNewEquipmentDialog"
import type {
  EquipmentDb,
  EquipmentWithQuantity,
  SerializedEquipmentItem,
  SerializedEquipmentKitItem,
} from "../lib/types"
import type { DataOffer } from "../store"

type RawEquipment = Prisma.EquipmentItemGetPayload<{
  include: { contents: { include: { item: true } } }
}>

type RawKitItem = Prisma.EquipmentKitItemGetPayload<{
  include: { item: true }
}>

export const getEquipments = async (): Promise<SerializedEquipmentItem[]> => {
  try {
    await requireUser()

    const items: RawEquipment[] = await prisma.equipmentItem.findMany({
      include: {
        contents: {
          include: {
            item: true,
          },
        },
      },
    })

    // 3. Рекурсивная функция с четкими типами Входа и Выхода
    const serializeItem = (item: RawEquipment): SerializedEquipmentItem => {
      return {
        ...item,
        // Явное приведение к строке
        price: item.price ? item.price.toString() : "0",
        // Типизируем маппинг вложений
        contents: item.contents?.map(
          (kitItem: RawKitItem): SerializedEquipmentKitItem => ({
            ...kitItem,
            price: kitItem.price ? kitItem.price.toString() : "0",
            // Рекурсивный вызов: приводим вложенный item к типу RawEquipment
            // так как по схеме он идентичен родителю
            item: serializeItem(kitItem.item as RawEquipment),
          }),
        ),
      }
    }

    return items.map(serializeItem)
  } catch (error) {
    console.error(error)
    // Убедись, что handleError возвращает массив, чтобы соответствовать Promise<SerializedEquipmentItem[]>
    return []
  }
}

export const addEquipment = async (item: EquipmentFormValues): Promise<void> => {
  try {
    await requireUser()
    await prisma.equipmentItem.create({
      data: {
        ...item,
        price: toDec(item.price),
      },
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const updateKitTotalPrice = async (kitId: string) => {
  const contents = await prisma.equipmentKitItem.findMany({
    where: { kitId },
  })

  const total = contents.reduce((sum, current) => {
    const itemPrice = Number(current.price || 0)
    return sum + itemPrice * current.count
  }, 0)

  return await prisma.equipmentItem.update({
    where: { id: kitId },
    data: {
      price: new Prisma.Decimal(total),
    },
  })
}

export const addToKit = async (
  kitId: string,
  itemsKit: EquipmentWithQuantity[],
): Promise<SerializedEquipmentKitItem[]> => {
  try {
    await requireUser()

    // 2. МАССОВОЕ ОБНОВЛЕНИЕ/СОЗДАНИЕ СВЯЗЕЙ (Транзакция)
    // Используем транзакцию, чтобы если один предмет не сохранится, откатилось всё
    await prisma.$transaction(
      itemsKit.map((item) =>
        prisma.equipmentKitItem.upsert({
          where: {
            kitId_itemId: {
              kitId: kitId,
              itemId: item.id,
            },
          },
          // Если связь есть — обновляем кол-во и цену
          update: {
            count: Number(item.count),
            price: toDec(item.price),
          },
          // Если связи нет — создаем новую запись в составе комплекта
          create: {
            kitId: kitId,
            itemId: item.id,
            count: Number(item.count),
            price: toDec(item.price),
            description: item.description || "",
          },
        }),
      ),
    )

    // 3. ПОЛУЧЕНИЕ АКТУАЛЬНЫХ ДАННЫХ
    // Запрашиваем из базы комплект со всеми его вложенными элементами (contents)
    const updatedKit = await prisma.equipmentItem.findUnique({
      where: { id: kitId },
      include: {
        contents: {
          include: {
            item: true,
          },
        },
      },
    })

    if (!updatedKit) throw new Error("Комплект не найден после обновления")

    // 4. СЕРИАЛИЗАЦИЯ ДЛЯ КЛИЕНТА (Next.js)
    // Prisma возвращает Decimal (объект), а клиент понимает только String.
    const serializedContents: SerializedEquipmentKitItem[] = updatedKit.contents.map((kitItem) => ({
      ...kitItem,
      price: kitItem.price.toString(),
      item: {
        ...kitItem.item,
        price: kitItem.item.price?.toString() || null,
        contents: [], // Заглушка для рекурсивного типа, так как на этом уровне contents не запрашивали
      },
    })) as unknown as SerializedEquipmentKitItem[]

    // 5. ПЕРЕСЧЕТ ОБЩЕЙ СТОИМОСТИ КОМПЛЕКТА
    await updateKitTotalPrice(kitId)

    return serializedContents
  } catch (error) {
    console.error("Ошибка в addToKit:", error)
    return handleError((error as Error).message)
  }
}

export const deleteFromKit = async (idKit: string, idsKitItem: string[]) => {
  try {
    await requireUser()

    // Удаляем записи из связующей таблицы,
    // где kitId совпадает с нашим комплектом,
    // а itemId входит в массив присланных ID
    const deleted = await prisma.equipmentKitItem.deleteMany({
      where: {
        kitId: idKit,
        itemId: {
          in: idsKitItem, // Оператор "in" фильтрует по массиву ID
        },
      },
    })

    // После удаления состава нужно пересчитать общую цену комплекта
    // (Если у тебя логика цены завязана на сумме вложений)
    await updateKitTotalPrice(idKit)

    return { success: true, count: deleted.count }
  } catch (error) {
    console.error("Ошибка при удалении из комплекта:", error)
    return handleError((error as Error).message)
  }
}

export const deleteEquipmentList = async (ids: string[]): Promise<void> => {
  try {
    const user = await requireUser()
    await checkUserPermissionByRole(user, [PermissionEnum.EQUIPMENT_DELETE])

    // 1. Находим все ID комплектов, в которые входили удаляемые товары.
    // Это нужно сделать ДО удаления, чтобы знать, чью цену пересчитывать.
    const affectedKits = await prisma.equipmentKitItem.findMany({
      where: { itemId: { in: ids } },
      select: { kitId: true },
    })

    // Получаем уникальный список ID комплектов
    const uniqueKitIds = Array.from(new Set(affectedKits.map((k) => k.kitId)))

    // 2. Удаляем оборудование.
    // Благодаря onDelete: Cascade в схеме, связи в EquipmentKitItem удалятся сами.
    await prisma.equipmentItem.deleteMany({
      where: { id: { in: ids } },
    })

    const kitIdsToUpdate = uniqueKitIds.filter((kitId) => !ids.includes(kitId))

    // 3. Пересчитываем цены для всех затронутых комплектов.
    // Выполняем это последовательно для каждого комплекта.
    if (kitIdsToUpdate.length > 0) {
      await Promise.all(kitIdsToUpdate.map((kitId) => updateKitTotalPrice(kitId)))
    }
  } catch (error) {
    console.error("Ошибка при массовом удалении оборудования:", error)
    return handleError((error as Error).message)
  }
}

export const updateEquipmentsList = async (items: Partial<EquipmentDb>[]) => {
  try {
    const user = await requireUser()
    await checkUserPermissionByRole(user, [PermissionEnum.EQUIPMENT_MANAGEMENT])

    const ids = items.map((i) => String(i.id))

    // 1. Находим существующие ID
    const existingItems = await prisma.equipmentItem.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    })
    const existingIds = new Set(existingItems.map((i) => i.id))

    // 2. Фильтруем только существующие
    const validUpdates = items.filter((item) => existingIds.has(String(item.id)))
    if (validUpdates.length === 0) return []

    // 3. Выполняем обновление в транзакции
    const updatedItems = await prisma.$transaction(
      validUpdates.map((item) => {
        const { id, ...payload } = item
        return prisma.equipmentItem.update({
          where: { id: String(id) },
          data: payload.price ? { ...payload, price: toDec(payload.price) } : payload,
        })
      }),
    )

    // 4. ЛОГИКА ОБНОВЛЕНИЯ ЦЕН В КОМПЛЕКТАХ
    // Если мы обновили цены ТОВАРОВ, нужно найти комплекты, где они лежат
    const updatedItemIds = validUpdates.filter((i) => i.price).map((i) => String(i.id))

    if (updatedItemIds.length > 0) {
      // Ищем все комплекты, которые зависят от этих товаров
      const affectedKits = await prisma.equipmentKitItem.findMany({
        where: { itemId: { in: updatedItemIds } },
        select: { kitId: true },
      })

      const kitIdsToUpdate = Array.from(new Set(affectedKits.map((k) => k.kitId)))

      // Пересчитываем цены комплектов
      if (kitIdsToUpdate.length > 0) {
        await Promise.all(kitIdsToUpdate.map((kitId) => updateKitTotalPrice(kitId)))
      }
    }

    // 5. СЕРИАЛИЗАЦИЯ для фронтенда
    return updatedItems.map((item) => ({
      ...item,
      price: item.price ? item.price.toString() : "0,00",
    }))
  } catch (error) {
    console.error("Ошибка при обновлении оборудования:", error)
    return handleError((error as Error).message)
  }
}

export const getOfferTemplates = async () => {
  try {
    const { userId } = await requireUser()
    const temp =
      (await prisma.offerTemplate.findMany({
        where: { ownerId: userId },
      })) || []

    return temp || []
  } catch (error) {
    console.error("Ошибка при получении шаблонов:", error)
    return handleError((error as Error).message)
  }
}

export const saveOfferTemplate = async (data: DataOffer, name: string) => {
  try {
    const { userId } = await requireUser()

    return await prisma.offerTemplate.upsert({
      where: {
        name_ownerId: {
          name: name,
          ownerId: userId,
        },
      },
      update: {
        json: JSON.stringify({ ...data, image: null }),
      },
      create: {
        name: name,
        ownerId: userId,
        json: JSON.stringify({ ...data, image: null }),
      },
    })
  } catch (error) {
    console.error(error)
    return handleError(
      "Ошибка сохранения: шаблон с таким именем уже существует или данные повреждены",
    )
  }
}

export const deleteOfferTemplate = async (templateId: string) => {
  try {
    await requireUser()
    return await prisma.offerTemplate.delete({
      where: {
        id: templateId,
      },
    })
  } catch (error) {
    console.error("Ошибка при удалении шаблона:", error)
    return handleError((error as Error).message)
  }
}
