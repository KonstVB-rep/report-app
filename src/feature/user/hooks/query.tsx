'use client';
import { PermissionEnum } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { getAllUsers, getUser } from "@/entities/user/api";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { checkTokens } from "@/shared/lib/helpers/checkTokens";
import { executeWithTokenCheck } from "@/shared/api/executeWithTokenCheck";

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
      try {
        if (!authUser?.id) throw new Error("Пользователь не авторизован");
        return await executeWithTokenCheck(getAllUsers);
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные");
        } else {
          TOAST.ERROR((error as Error).message);
        }
        throw error;
      }
    },
    enabled: !!userId,
    retry: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
