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
