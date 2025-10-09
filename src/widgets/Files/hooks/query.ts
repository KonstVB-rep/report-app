import { DealFile, DealType } from "@prisma/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getInfoDisk, getResourceInfo } from "@/app/api/yandex-disk/yandexDisk";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/custom-components/ui/Toast";

import { getAllFilesDealFromDb } from "../api/actions_db";
import { FileResourceYndx } from "../types";

export const useGetHrefFilesDealFromDB = (
  data:
    | {
        userId: string;
        dealId: string;
        dealType: DealType;
      }
    | undefined
): UseQueryResult<DealFile[], Error> => {
  const { isAuth } = useStoreUser();
  return useQuery({
    queryKey: ["get-deal-files", data?.userId, data?.dealId, data?.dealType],
    queryFn: async () => {
      try {
        if (!isAuth) throw new Error("Пользователь не авторизован");

        if (!data) throw new Error("Данные не переданы");

        const { userId, dealId, dealType } = data;

        const files = await getAllFilesDealFromDb(userId, dealId, dealType);

        return files;
      } catch (error) {
        console.error("Ошибка при получении файлов сделки:", error);
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные");
        } else {
          TOAST.ERROR((error as Error).message);
        }
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

export const useGetResourceInfo = (
  path: string
): UseQueryResult<FileResourceYndx, Error> => {
  const { isAuth } = useStoreUser();

  return useQuery({
    queryKey: ["get-resource-info", path],
    queryFn: async () => {
      if (!isAuth) throw new Error("Пользователь не авторизован");
      return await getResourceInfo(path);
    },
    enabled: !!isAuth,
  });
};
