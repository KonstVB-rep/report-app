import { PermissionEnum } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { TOAST } from "@/shared/ui/Toast";

import { getUser } from "../api";
import useStoreUser from "../store/useStoreUser";

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
    retry: 0,
  });
};
