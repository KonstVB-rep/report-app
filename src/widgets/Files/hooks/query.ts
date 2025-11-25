import type { DealFile, DealType } from "@prisma/client"
import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { getInfoDisk, getResourceInfo } from "@/app/api/yandex-disk/yandexDisk"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { getAllFilesDealFromDb } from "../api/actions_db"
import type { FileResourceYndx } from "../types"

export const useGetHrefFilesDealFromDB = (
  data:
    | {
        userId: string
        dealId: string
        dealType: DealType
      }
    | undefined,
): UseQueryResult<DealFile[], Error> => {
  const { isAuth } = useStoreUser()
  return useQuery({
    queryKey: ["get-deal-files", data?.userId, data?.dealId, data?.dealType],
    queryFn: async () => {
      try {
        if (!isAuth) throw new Error("Пользователь не авторизован")

        if (!data) throw new Error("Данные не переданы")

        const { userId, dealId, dealType } = data

        const files = await getAllFilesDealFromDb(userId, dealId, dealType)

        return files
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить документы по проекту")
          console.error("Ошибка при получении файлов сделки:", "Failed to fetch")
        } else {
          TOAST.ERROR("Не удалось получить документы по проекту")
          console.log(error)
        }
        throw error
      }
    },
    enabled: !!isAuth && !!data?.userId && !!data?.dealId && !!data?.dealType,
  })
}
export const useGetInfoYandexDisk = () => {
  const { isAuth } = useStoreUser()
  return useQuery({
    queryKey: ["info-yandex-disk"],
    queryFn: async () => {
      if (!isAuth) throw new Error("Пользователь не авторизован")
      return await getInfoDisk()
    },
    enabled: !!isAuth,
    refetchOnMount: true,
  })
}

export const useGetResourceInfo = (path: string): UseQueryResult<FileResourceYndx, Error> => {
  const { isAuth } = useStoreUser()

  return useQuery({
    queryKey: ["get-resource-info", path],
    queryFn: async () => {
      if (!isAuth) throw new Error("Пользователь не авторизован")
      return await getResourceInfo(path)
    },
    enabled: !!isAuth,
  })
}
