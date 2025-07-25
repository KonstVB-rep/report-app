"use server";

import { UserFilter } from "@prisma/client";

import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";

import {
  DeleteFilterReturnType,
  SaveFilterType,
  UpdateFilterDataType,
} from "../types";

export const getUserFilters = async () => {
  try {
    const { user } = await handleAuthorization();
    if (!user?.id) {
      throw new Error("User ID отсутствует");
    }

    const filters = await prisma.userFilter.findMany({
      where: { userId: user.id },
    });

    return filters;
  } catch (error) {
    console.error("Ошибка в getUserFilters:", error);
    return handleError((error as Error).message || "Произошла ошибка");
  }
};

export const getUserFilterById = async (filterId: string) => {
  try {
    const { user } = await handleAuthorization();

    if (!user?.id) {
      throw new Error("User ID отсутствует");
    }

    const filter = await prisma.userFilter.findUnique({
      where: { userId: user.id, id: filterId },
    });

    return filter;
  } catch (error) {
    console.error("Ошибка в getUserFilters:", error);
    return handleError((error as Error).message || "Произошла ошибка");
  }
};

export const saveFilter = async (
  savedData: SaveFilterType
): Promise<UserFilter> => {
  try {
    const { user } = await handleAuthorization();

    const { data } = savedData;

    const existingFilter = await prisma.userFilter.findUnique({
      where: { id: user!.id, filterName: data.filterName },
    });

    if (existingFilter) {
      return handleError("Фильтр уже существует");
    }

    const newFilter = await prisma.userFilter.create({
      data: {
        ...data,
        userId: user!.id,
      },
    });

    return newFilter;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const deleteFilter = async (data: {
  id: string;
}): Promise<DeleteFilterReturnType> => {
  try {
    await handleAuthorization();

    const { id } = data;

    const filter = await prisma.userFilter.findUnique({
      where: { id },
    });

    if (!filter) {
      return handleError("Фильтр не найден");
    }

    await prisma.userFilter.delete({
      where: { id },
    });

    return { data: null, message: "Фильтр успешно удален", error: false };
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const updateFilter = async (
  data: UpdateFilterDataType
): Promise<UserFilter | undefined> => {
  try {
    await handleAuthorization();

    const filter = await prisma.userFilter.findUnique({
      where: { id: data.id },
    });

    if (!filter) {
      return handleError("Фильтр не найден");
    }

    const updatedFilter = await prisma.userFilter.update({
      where: { id: data.id },
      data,
    });

    return updatedFilter;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const selectFilter = async (id: string) => {
  try {
    const { user } = await handleAuthorization();

    const filter = await prisma.userFilter.findUnique({
      where: { id },
    });

    if (!filter) {
      return handleError("Фильтр не найден");
    }

    if (filter.userId !== user!.id) {
      return handleError("Недостаточно прав");
    }

    await prisma.userFilter.updateMany({
      where: { userId: user!.id },
      data: { isActive: false },
    });

    await prisma.userFilter.update({
      where: { id },
      data: { isActive: true },
    });

    return { success: true, message: "Фильтр успешно выбран" };
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const disableSavedFilters = async () => {
  try {
    const { user } = await handleAuthorization();

    if (!user?.id) {
      throw new Error("Пользователь не найден");
    }

    await prisma.userFilter.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    });
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};
