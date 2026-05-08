"use server";

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { requireUser } from "@/app/api/utils/requireAuth ";
import { prisma } from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";
import { toDec } from "@/shared/lib/utils";
import { PermissionEnum } from "@prisma/client";
import type { EquipmentFormValues } from "../components/AddNewEquipmentDialog";
import type {
  EquipmentDb,
  EquipmentWithQuantity,
  SerializedEquipmentKitItem,
} from "../lib/types";

export const getEquipments = async (): Promise<EquipmentWithQuantity[]> => {
  try {
    await requireUser();
    const items = await prisma.equipmentItem.findMany({
      include: {
        contents: {
          include: {
            item: true,
          },
        },
      },
    });
    const serializeItem = (item: any) => ({
      ...item,
      price: item.price ? item.price.toString() : "0",
      contents: item.contents?.map((kitItem: any) => ({
        ...kitItem,
        price: kitItem.price ? kitItem.price.toString() : "0",
        // Рекурсивно обрабатываем вложенный item, если он есть
        item: kitItem.item ? serializeItem(kitItem.item) : null,
      })),
    });

    return items.map(serializeItem);
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const addEquipment = async (
  item: EquipmentFormValues,
): Promise<void> => {
  try {
    await requireUser();
    await prisma.equipmentItem.create({
      data: {
        ...item,
        price: toDec(item.price),
      },
    });
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const addToKit = async (
  kitId: string,
  itemsKit: EquipmentWithQuantity[],
): Promise<SerializedEquipmentKitItem[]> => {
  try {
    // 1. ПРОВЕРКА АВТОРИЗАЦИИ
    // Проверяем, имеет ли пользователь право вносить изменения
    await requireUser();

    // 2. МАССОВОЕ ОБНОВЛЕНИЕ/СОЗДАНИЕ СВЯЗЕЙ (Транзакция)
    // Используем транзакцию, чтобы если один предмет не сохранится, откатилось всё
    await prisma.$transaction(
      itemsKit.map((item) =>
        prisma.equipmentKitItem.upsert({
          // Ищем существующую связь по уникальной паре: ID комплекта + ID товара
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
    );

    // 3. ПОЛУЧЕНИЕ АКТУАЛЬНЫХ ДАННЫХ
    // Запрашиваем из базы комплект со всеми его вложенными элементами (contents)
    const updatedKit = await prisma.equipmentItem.findUnique({
      where: { id: kitId },
      include: {
        contents: {
          include: {
            item: true, // Подтягиваем инфо о самом оборудовании (имя, картинка)
          },
        },
      },
    });

    if (!updatedKit) throw new Error("Комплект не найден после обновления");

    // 4. СЕРИАЛИЗАЦИЯ ДЛЯ КЛИЕНТА (Next.js)
    // Prisma возвращает Decimal (объект), а клиент понимает только String.
    // Проходимся по всем элементам и конвертируем цены в строки.
    const serializedContents: SerializedEquipmentKitItem[] =
      updatedKit.contents.map((kitItem) => ({
        ...kitItem,
        price: kitItem.price.toString(), // Цена строки в комплекте
        item: {
          ...kitItem.item,
          price: kitItem.item.price?.toString() || null, // Розничная цена товара
          contents: [], // Заглушка для рекурсивного типа, так как на этом уровне contents не запрашивали
        },
      })) as unknown as SerializedEquipmentKitItem[];

    // 5. ПЕРЕСЧЕТ ОБЩЕЙ СТОИМОСТИ КОМПЛЕКТА
    // Чтобы в общем каталоге цена комплекта была актуальной, считаем сумму всех вложений
    const totalSum = serializedContents.reduce((sum, current) => {
      return sum + Number(current.price) * current.count;
    }, 0);

    // 6. СОХРАНЕНИЕ ИТОГОВОЙ ЦЕНЫ В РОДИТЕЛЯ
    // Обновляем "лицо" комплекта в таблице EquipmentItem
    await prisma.equipmentItem.update({
      where: { id: kitId },
      data: {
        price: toDec(totalSum),
      },
    });

    // Возвращаем на фронтенд чистый массив объектов (Plain Objects)
    return serializedContents;
  } catch (error) {
    // В случае любой ошибки выводим её в консоль сервера и прокидываем в обработчик
    console.error("Ошибка в addToKit:", error);
    return handleError((error as Error).message);
  }
};

// export const addToKit = async (
//   kitId: string,
//   itemsKit: EquipmentWithQuantity[],
// ): Promise<Omit<SerializedEquipmentKitItem, "createdAt" | "updatedAt">[]> => {
//   try {
//     await requireUser();
//     await prisma.$transaction(
//       itemsKit.map((item) =>
//         prisma.equipmentKitItem.upsert({
//           where: {
//             kitId_itemId: {
//               kitId: kitId,
//               itemId: item.id,
//             },
//           },
//           update: {
//             count: Number(item.count),
//             price: toDec(item.price),
//           },
//           create: {
//             kitId: kitId,
//             itemId: item.id,
//             count:Number(item.count),
//             price: toDec(item.price),
//             description: item.description || "",
//           },
//         }),
//       ),
//     );

//     const updatedKit = await prisma.equipmentItem.findUnique({
//       where: { id: kitId },
//       include: {
//         contents: {
//           include: {
//             item: true,
//           },
//         },
//       },
//     });

//     if (!updatedKit) throw new Error("Комплект не найден");

//     const serializedContents = updatedKit.contents.map((kitItem) => ({
//       ...kitItem,
//       price: kitItem.price.toString(),
//       item: {
//         ...kitItem.item,
//         price: kitItem.item.price?.toString() || null,
//       },
//     }));

//     return serializedContents;
//   } catch (error) {
//     console.error(error);
//     return handleError((error as Error).message);
//   }
// };

export const deleteEquipmentList = async (ids: string[]): Promise<void> => {
  try {
    const user = await requireUser();

    await checkUserPermissionByRole(user, [PermissionEnum.EQUIPMENT_DELETE]);

    console.log(ids, "ids");

    await prisma.equipmentItem.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const updateEquipmentsList = async (items: Partial<EquipmentDb>[]) => {
  try {
    const user = await requireUser();

    await checkUserPermissionByRole(user, [
      PermissionEnum.EQUIPMENT_MANAGEMENT,
    ]);

    const ids = items.map((i) => String(i.id));

    // Находим все существующие ID в базе
    const existingItems = await prisma.equipmentItem.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    const existingIds = new Set(existingItems.map((i) => i.id));

    // Фильтруем только те, что реально есть в базе
    const validUpdates = items.filter((item) =>
      existingIds.has(String(item.id)),
    );

    if (validUpdates.length === 0) return [];

    const updatedItems = await prisma.$transaction(
      validUpdates.map((item) => {
        const { id, ...payload } = item;
        return prisma.equipmentItem.update({
          where: { id: String(id) },
          data: payload,
        });
      }),
    );

    // СЕРИАЛИЗАЦИЯ: превращаем Decimal в числа
    return updatedItems.map((item) => ({
      ...item,
      price: item.price ? item.price.toString() : "0,00", // или .toString(), если важна точность до копеек
      createdAt: item.createdAt.toISOString(), // Date тоже лучше привести к строке
      updatedAt: item.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};
