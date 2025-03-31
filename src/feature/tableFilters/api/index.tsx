'use server'

import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";
import { UserFilter } from "@prisma/client";

  
  
  export const getUserFilters = async () => {
    try {
  
      const { user } = await handleAuthorization();
  ;
  
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
      console.log("Начало getUserFilters");
  
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
    ownerId: string,
    data: Omit<UserFilter, "createdAt" | "updatedAt" | "id" | "userId">,
  ) => {
    try {
      const { user } = await handleAuthorization();
  
  
      const existingFilter = await prisma.userFilter.findUnique({
        where: { id: user!.id, filterName: data.filterName }, 
      });
  
      if (existingFilter) {
        return handleError("Фильтр уже существует");
      }
  
      if (user!.id !== ownerId) {
        return handleError("ВЫ не можете создать фильтр на другого пользователя");
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
  
  export const deleteFilter = async (id: string) => {
  

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
    data: Partial<UserFilter>
  ): Promise<UserFilter | undefined> => {
    try {
      const { user } = await handleAuthorization();
  
      const filter = await prisma.userFilter.findUnique({
        where: { id:data.id },
      });
  
      if (!filter) {
        return handleError("Фильтр не найден");
      }
  
      if (filter.userId !== user!.id) {
        return handleError("Недостаточно прав");
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
  
