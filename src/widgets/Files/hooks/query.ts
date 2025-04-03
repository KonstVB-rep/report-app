import useStoreUser from "@/entities/user/store/useStoreUser";
import { useQuery } from "@tanstack/react-query";
import { getAllFilesDealFromDb } from "../api/actions_db";
import { DealType } from "@prisma/client";
import { TOAST } from "@/entities/user/ui/Toast";
import { getInfoDisk } from "@/app/api/utils/yandexDisk";

export const useGetHrefFilesDealFromDB = (
  userId: string,
  dealId: string,
  dealType: DealType
) => {
  const { isAuth } = useStoreUser();
  return useQuery({
    queryKey: ["files-deal", userId, dealId, dealType],
    queryFn: async () => {
      try {
        if (!isAuth) throw new Error("Пользователь не авторизован");

        // Получаем все файлы сделки из базы данных
        const files = await getAllFilesDealFromDb(userId, dealId, dealType);
        
        return files;  // Возвращаем данные
      } catch (error) {
        console.error("Ошибка при получении файлов сделки:", error);
        TOAST.ERROR((error as Error).message);
        throw error;  // Прокидываем ошибку, чтобы useQuery мог её обработать
      }
    },
    // Проверяем, чтобы запрос выполнялся только если все данные валидны
    enabled: !!isAuth && !!userId && !!dealId && !!dealType,
  });
};


export const useGetInfoYandexDisk = () => {
    const {isAuth} = useStoreUser();
      return useQuery({
      queryKey: ["info-yandex-disk"],
      queryFn: async () => {
        if (!isAuth) throw new Error("Пользователь не авторизован");
        return await getInfoDisk();
      },
      enabled: !!isAuth,
      refetchOnMount: true,
    });
}