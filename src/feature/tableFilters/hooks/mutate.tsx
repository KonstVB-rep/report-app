import { UserFilter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { getQueryClient } from "@/app/provider/query-provider";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import {
  deleteFilter,
  disableSavedFilters,
  saveFilter,
  selectFilter,
  updateFilter,
} from "../api";

const queryClient = getQueryClient();

export const useSaveFilter = (setOpen: (value: boolean) => void) => {
  const { authUser } = useStoreUser();
  return useMutation({
    mutationFn: ({
      ownerId,
      data,
    }: {
      ownerId: string;
      data: Omit<UserFilter, "createdAt" | "updatedAt" | "id" | "userId">;
    }) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }
      return saveFilter(ownerId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filters", authUser?.id],
        exact: true,
      });
      TOAST.SUCCESS("Фильтр сохранен");
      setOpen(false);
    },
    onError: (error) => {
      setOpen(false);
      console.log("error", error);
      TOAST.ERROR("Ошибка сохранения фильтра");
    },
  });
};

export const useUpdateFilter = () => {
  const { authUser } = useStoreUser();
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: Omit<UserFilter, "createdAt" | "updatedAt">;
    }) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не найден");
      }

      return updateFilter(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filters", authUser?.id],
        exact: true,
      });
      TOAST.SUCCESS("Фильтр обновлен");
    },
    onError: (error) => {
      TOAST.ERROR(error.message);
    },
  });
};

export const useDeleteFilter = () => {
  const { authUser } = useStoreUser();
  return useMutation({
    mutationFn: (filterId: string) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не найден");
      }
      return deleteFilter(filterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filters", authUser?.id],
        exact: true,
      });
    },
    onError: (error) => {
      TOAST.ERROR(error.message);
    },
  });
};

export const useSelectFilter = () => {
  const { authUser } = useStoreUser();
  return useMutation({
    mutationKey: ["selectFilter", authUser?.id],
    mutationFn: (filterId: string) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }
      return selectFilter(filterId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filters", authUser?.id],
        exact: true,
      });
    },
    onError: (error) => {
      TOAST.ERROR(error.message);
    },
  });
};

export const useDisableSavedFilters = () => {
  const { authUser } = useStoreUser();
  return useMutation({
    mutationFn: () => {
      if (!authUser?.id) {
        throw new Error("Пользователь не найден");
      }
      return disableSavedFilters();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filters", authUser?.id],
        exact: true,
      });
    },
    onError: (error) => {
      TOAST.ERROR(error.message);
    },
  });
};
