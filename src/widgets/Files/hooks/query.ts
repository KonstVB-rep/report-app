import { DealType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { getInfoDisk } from "@/app/api/yandex-disk/yandexDisk";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import { getAllFilesDealFromDb } from "../api/actions_db";

export const useGetHrefFilesDealFromDB = (
  data:
    | {
        userId: string;
        dealId: string;
        dealType: DealType;
      }
    | undefined
) => {
  const { isAuth } = useStoreUser();
  return useQuery({
    queryKey: ["get-deal-files", data?.userId, data?.dealId, data?.dealType],
    queryFn: async () => {
      try {
        if (!isAuth) throw new Error("Пользователь не авторизован");

        if (!data) throw new Error("Данные не переданы");

        const { userId, dealId, dealType } = data;

        // Получаем все файлы сделки из базы данных
        const files = await getAllFilesDealFromDb(userId, dealId, dealType);

        return files;
      } catch (error) {
        console.error("Ошибка при получении файлов сделки:", error);
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!isAuth && !!data?.userId && !!data?.dealId && !!data?.dealType,
  });
};
export const useGetInfoYandexDisk = () => {
  const { isAuth } = useStoreUser();
  return useQuery({
    queryKey: ["info-yandex-disk"],
    queryFn: async () => {
      if (!isAuth) throw new Error("Пользователь не авторизован");
      return await getInfoDisk();
    },
    enabled: !!isAuth,
    refetchOnMount: true,
  });
};
