"use server";

import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import { prisma } from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";
import { Prisma, type UserFilter } from "@prisma/client";
import type {
  DeleteFilterReturnType,
  SaveFilterType,
  UpdateFilterDataType,
} from "../types";

const getAuthUser = async () => {
  const { user } = await handleAuthorization();
  if (!user?.id) throw new Error("Пользователь не авторизован");
  return user;
};

export const getUserFilters = async () => {
  try {
    const user = await getAuthUser();

    return await prisma.userFilter.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Ошибка в getUserFilters:", error);
    return handleError((error as Error).message || "Произошла ошибка");
  }
};

export const getUserFilterById = async (filterId: string) => {
  try {
    const user = await getAuthUser();

    return await prisma.userFilter.findFirst({
      where: { id: filterId, userId: user.id },
    });
  } catch (error) {
    console.error("Ошибка в getUserFilters:", error);
    return handleError((error as Error).message || "Произошла ошибка");
  }
};

// export const saveFilter = async (savedData: SaveFilterType): Promise<UserFilter> => {
//   try {
//     const { user } = await handleAuthorization()

//     const { data } = savedData

//      const existing = await prisma.userFilter.findFirst({
//       where: { userId: user.id, filterName: data.filterName }
//     })

//     if (existing) return handleError("Фильтр с таким именем уже существует")

//     return await prisma.userFilter.create({
//       data: { ...data, userId: user.id },
//     })
//   } catch (error) {
//     console.error(error)
//     return handleError((error as Error).message)
//   }
// }

// export const deleteFilter = async (data: { id: string }): Promise<DeleteFilterReturnType> => {
//   try {
//    const user = await getAuthUser()

//     const { count } = await prisma.userFilter.deleteMany({
//       where: {
//         id: data.id,
//         userId: user.id
//       },
//     })

//     if (count === 0) return handleError("Фильтр не найден или нет прав")

//     return { data: null, message: "Фильтр успешно удален", error: false }
//   } catch (error) {
//     console.error(error)
//     return handleError((error as Error).message)
//   }
// }

// export const updateFilter = async (data: UpdateFilterDataType): Promise<UserFilter | undefined> => {
//   try {
//    const user = await getAuthUser()

//     // Prisma update требует уникальный селектор.
//     // Если id уникален, мы обновляем с проверкой userId через updateMany
//     // или через update, если в схеме есть @@unique([id, userId])
//     const updated = await prisma.userFilter.update({
//       where: { id: data.id, userId: user.id }, // Добавляем проверку владельца
//       data,
//     })

//     return updated
//   } catch (error) {
//     console.error(error)
//     return handleError((error as Error).message)
//   }
// }

// export const selectFilter = async (id: string) => {
//   try {
//     const { user } = await handleAuthorization()

//     const filter = await prisma.userFilter.findUnique({
//       where: { id },
//     })

//     if (!filter) {
//       return handleError("Фильтр не найден")
//     }

//     if (filter.userId !== user?.id) {
//       return handleError("Недостаточно прав")
//     }

//     await prisma.userFilter.updateMany({
//       where: { userId: user?.id },
//       data: { isActive: false },
//     })

//     await prisma.userFilter.update({
//       where: { id },
//       data: { isActive: true },
//     })

//     return { success: true, message: "Фильтр успешно выбран" }
//   } catch (error) {
//     console.error(error)
//     return handleError((error as Error).message)
//   }
// }

// export const disableSavedFilters = async () => {
//   try {
//     const { user } = await handleAuthorization()

//     if (!user?.id) {
//       throw new Error("Пользователь не найден")
//     }

//     await prisma.userFilter.updateMany({
//       where: { userId: user.id },
//       data: { isActive: false },
//     })
//   } catch (error) {
//     console.error(error)
//     return handleError((error as Error).message)
//   }
// }
export const saveFilter = async (
  savedData: SaveFilterType,
): Promise<UserFilter> => {
  try {
    const user = await getAuthUser();
    const { data } = savedData;

    // Мы можем либо использовать upsert (обновить если имя совпало),
    // либо create (выдаст ошибку если имя совпало).
    // По твоей логике — выдаем ошибку, если имя занято.
    return await prisma.userFilter.create({
      data: {
        ...data,
        userId: user.id,
      },
    });
  } catch (error) {
    // Перехватываем ошибку уникальности Prisma (P2002)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return handleError("Фильтр с таким именем уже существует");
    }
    return handleError("Ошибка сохранения фильтра");
  }
};

/**
 * УДАЛЕНИЕ: Атомарно и безопасно.
 */
export const deleteFilter = async (data: {
  id: string;
}): Promise<DeleteFilterReturnType> => {
  try {
    const user = await getAuthUser();

    // Используем deleteMany, чтобы проверить userId без лишнего findUnique
    const { count } = await prisma.userFilter.deleteMany({
      where: {
        id: data.id,
        userId: user.id,
      },
    });

    if (count === 0) return handleError("Фильтр не найден или нет прав");

    return { data: null, message: "Фильтр успешно удален", error: false };
  } catch (error) {
    return handleError("Не удалось удалить фильтр");
  }
};

/**
 * ОБНОВЛЕНИЕ: Безопасное изменение.
 */
export const updateFilter = async (
  data: UpdateFilterDataType,
): Promise<UserFilter | undefined> => {
  try {
    const user = await getAuthUser();

    // В Prisma update требует уникальный селектор.
    // Поскольку у нас теперь есть составной уникальный ключ, можно использовать его,
    // но обычно проще сделать через updateMany (для безопасности) + findFirst.
    const { count } = await prisma.userFilter.updateMany({
      where: { id: data.id, userId: user.id },
      data,
    });

    if (count === 0) return handleError("Фильтр не найден или нет прав");

    return (await prisma.userFilter.findUnique({
      where: { id: data.id },
    })) as UserFilter;
  } catch (error) {
    return handleError("Ошибка обновления");
  }
};

/**
 * ВЫБОР: Атомарная транзакция.
 */
export const selectFilter = async (id: string) => {
  try {
    const user = await getAuthUser();

    // Выполняем обе операции или ни одной
    await prisma.$transaction([
      // Сбрасываем активность ВСЕХ фильтров юзера
      prisma.userFilter.updateMany({
        where: { userId: user.id },
        data: { isActive: false },
      }),
      // Активируем один конкретный
      prisma.userFilter.updateMany({
        where: { id, userId: user.id },
        data: { isActive: true },
      }),
    ]);

    return { success: true, message: "Фильтр успешно выбран" };
  } catch (error) {
    return handleError("Ошибка при выборе фильтра");
  }
};

/**
 * СБРОС: Быстрое отключение всех фильтров.
 */
export const disableSavedFilters = async () => {
  try {
    const user = await getAuthUser();

    await prisma.userFilter.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    });

    return { success: true };
  } catch (error) {
    return handleError("Ошибка сброса");
  }
};
