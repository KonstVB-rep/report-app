import type { UserFilter } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import {
  deleteFilter,
  disableSavedFilters,
  saveFilter,
  selectFilter,
  updateFilter,
} from "../api/filter.actions"
import type { SaveFilterType } from "../types"

export const useSaveFilter = (setOpen: (value: boolean) => void) => {
  const { queryClient, authUser } = useFormSubmission()
  return useMutation({
    mutationFn: async (saveData: SaveFilterType) => saveFilter(saveData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filters", authUser?.id],
        exact: true,
      })
      TOAST.SUCCESS("Фильтр сохранен")
      setOpen(false)
    },
    onError: (error) => {
      setOpen(false)
      console.log("error", error)
      TOAST.ERROR("Ошибка сохранения фильтра")
    },
  })
}

export const useUpdateFilter = () => {
  const { queryClient, authUser } = useFormSubmission()
  return useMutation({
    mutationFn: ({ data }: { data: Omit<UserFilter, "createdAt" | "updatedAt"> }) =>
      updateFilter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filters", authUser?.id],
        exact: true,
      })
      TOAST.SUCCESS("Фильтр обновлен")
    },
    onError: (error) => {
      TOAST.ERROR(error.message)
    },
  })
}

export const useDeleteFilter = () => {
  const { queryClient, authUser } = useFormSubmission()
  return useMutation({
    mutationFn: async (filterId: string) => await deleteFilter({ id: filterId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filters", authUser?.id],
        exact: true,
      })
    },
    onError: (error) => {
      TOAST.ERROR(error.message)
    },
  })
}

export const useSelectFilter = () => {
  const { authUser } = useStoreUser()
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ["selectFilter", authUser?.id],
    mutationFn: async (filterId: string) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing")
      }
      return await selectFilter(filterId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filters", authUser?.id],
        exact: true,
      })
    },
    onError: (error) => {
      TOAST.ERROR(error.message)
    },
  })
}

export const useDisableSavedFilters = () => {
  const { authUser } = useStoreUser()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      if (!authUser?.id) {
        throw new Error("Пользователь не найден")
      }
      return await disableSavedFilters()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filters", authUser?.id],
        exact: true,
      })
    },
    onError: (error) => {
      TOAST.ERROR(error.message)
    },
  })
}
