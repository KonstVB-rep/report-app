import { useQuery } from "@tanstack/react-query";
import { getUser, getUserShort } from "../api";
import { UserWithdepartmentName } from "../types";
import { TOAST } from "../ui/Toast";
import { PermissionEnum, Prisma } from "@prisma/client";

export const useGetUser = (
  userId: string,
  permissions?: PermissionEnum[] | undefined
) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        return await getUser(userId as string, permissions as PermissionEnum[]);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error("Prisma ошибка:", error.code);
          TOAST.ERROR("Ошибка cхемы Prisma");
        } else if (error instanceof Prisma.PrismaClientValidationError) {
          console.error("Ошибка валидации:", error.message);
          TOAST.ERROR("Ошибка валидации");
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
          console.error("Ошибка подключения:", error.message);
          TOAST.ERROR("Ошибка подключения");
        } else {
          console.error("Другая ошибка:", (error as Error).message);
          TOAST.ERROR((error as Error).message);
        }
        throw error;
      }
    },
    enabled: !!userId,
    retry: 2,
  });
};

export const useGetUserShortInfo = (userId: string) => {
  return useQuery<UserWithdepartmentName | undefined>({
    queryKey: ["user-short", userId],
    queryFn: async () => {
      try {
        return (await getUserShort(userId)) as UserWithdepartmentName;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          console.error("Prisma ошибка:", error.code);
          TOAST.ERROR("Ошибка cхемы Prisma");
        } else if (error instanceof Prisma.PrismaClientValidationError) {
          console.error("Ошибка валидации:", error.message);
          TOAST.ERROR("Ошибка валидации");
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
          console.error("Ошибка подключения:", error.message);
          TOAST.ERROR("Ошибка подключения");
        } else {
          console.error("Другая ошибка:", (error as Error).message);
          TOAST.ERROR((error as Error).message);
        }
        throw error;
      }
    },
    enabled: !!userId,
  });
};
