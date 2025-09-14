"use client";

import { PermissionEnum } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { getAllUsers, getUser } from "@/entities/user/api";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { executeWithTokenCheck } from "@/shared/api/executeWithTokenCheck";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { checkTokens } from "@/shared/lib/helpers/checkTokens";

export const useGetUser = (
  userId: string,
  permissions?: PermissionEnum[] | undefined
) => {
  const { authUser } = useStoreUser();
  const authUserId = authUser?.id;
  return useQuery({
    queryKey: ["user", userId, authUserId],
    queryFn: async () => {
      try {
        if (!authUserId) throw new Error("Пользователь не авторизован");
        return await getUser(userId as string, permissions as PermissionEnum[]);
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные");
        } else {
          TOAST.ERROR((error as Error).message);
        }
        throw error;
      }
    },
    enabled: !!userId && !!authUserId,
    retry: 0,
  });
};

export const useGetAllUsers = () => {
  const { authUser } = useStoreUser();
  const userId = authUser?.id;

  return useQuery({
    queryKey: ["all-users", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Пользователь не авторизован");
      try {
        return await executeWithTokenCheck(getAllUsers);
      } catch (error) {
        TOAST.ERROR((error as Error).message || "Не удалось получить данные");
        throw error;
      }
    },
    enabled: !!userId,
    retry: 0,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
