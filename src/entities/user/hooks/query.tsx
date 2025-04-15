import { PermissionEnum } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { TOAST } from "@/shared/ui/Toast";

import { getUser, getUserShort } from "../api";
import useStoreUser from "../store/useStoreUser";
import { UserWithdepartmentName } from "../types";

export const useGetUser = (
  userId: string,
  permissions?: PermissionEnum[] | undefined
) => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        if (!authUser?.id) throw new Error("Пользователь не авторизован");
        return await getUser(userId as string, permissions as PermissionEnum[]);
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 2,
  });
};

export const useGetUserShortInfo = (userId: string) => {
  const { authUser } = useStoreUser();
  return useQuery<UserWithdepartmentName | undefined>({
    queryKey: ["user-short", userId],
    queryFn: async () => {
      try {
        if (!authUser?.id) throw new Error("Пользователь не авторизован");
        return (await getUserShort(userId)) as UserWithdepartmentName;
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
  });
};
