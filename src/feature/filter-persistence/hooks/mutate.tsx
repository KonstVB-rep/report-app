import { UserFilter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { getQueryClient } from "@/app/provider/query-provider";
import useStoreUser from "@/entities/user/store/useStoreUser";
import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";

import {
  deleteFilter,
  disableSavedFilters,
  saveFilter,
  selectFilter,
  updateFilter,
} from "../api";
import {
  DeleteFilterReturnType,
  SaveFilterType,
  UpdateFilterDataType,
} from "../types";

const queryClient = getQueryClient();

export const useSaveFilter = (setOpen: (value: boolean) => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: (saveData: SaveFilterType) => {
      return handleMutationWithAuthCheck<SaveFilterType, UserFilter>(
        saveFilter,
        saveData,
        authUser,
        isSubmittingRef
      );
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
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: Omit<UserFilter, "createdAt" | "updatedAt">;
    }) => {
      return handleMutationWithAuthCheck<
        UpdateFilterDataType,
        UserFilter | undefined
      >(updateFilter, data, authUser, isSubmittingRef);
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
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: (filterId: string) => {
      return handleMutationWithAuthCheck<
        { id: string },
        DeleteFilterReturnType
      >(deleteFilter, { id: filterId }, authUser, isSubmittingRef);
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
