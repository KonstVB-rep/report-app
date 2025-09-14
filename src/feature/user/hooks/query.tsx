'use client';
import { PermissionEnum } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { getAllUsers, getUser } from "@/entities/user/api";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { checkTokens } from "@/shared/lib/helpers/checkTokens";

export const useGetUser = (
  userId: string,
  permissions?: PermissionEnum[] | undefined
) => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["user", userId, authUser?.id],
    queryFn: async () => {
      try {
        if (!authUser?.id) throw new Error("Пользователь не авторизован");
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
    enabled: !!userId && !!authUser?.id,
    retry: 0,
  });
};

export const useGetAllUsers = () => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["all-users", authUser?.id],
    queryFn: async () => {
      try {
        if (!authUser?.id) throw new Error("Пользователь не авторизован");
        // await checkTokens();
        return await getAllUsers();
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные");
        } else {
          TOAST.ERROR((error as Error).message);
        }
        throw error;
      }
    },
    enabled: !!authUser?.id,
    retry: 0,
  });
};
