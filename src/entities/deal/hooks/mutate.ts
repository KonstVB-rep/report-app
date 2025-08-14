"use client";

import {
  DealType,
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { Dispatch, SetStateAction } from "react";
import { DeepPartial } from "react-hook-form";

import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";
import { checkAuthorization } from "@/shared/lib/helpers/checkAuthorization";

import {
  createProject,
  createRetail,
  deleteDeal,
  updateProject,
  updateRetail,
} from "../api";
import {
  defaultProjectValues,
  defaultRetailValues,
} from "../model/defaultvaluesForm";
import { ProjectSchema, RetailSchema } from "../model/schema";
import {
  ProjectResponse,
  ProjectWithManagersIds,
  ProjectWithoutDateCreateAndUpdate,
  ProjectWithoutId,
  RetailResponse,
  RetailWithManagersIds,
  RetailWithoutDateCreateAndUpdate,
  RetailWithoutId,
} from "../types";
import handleErrorSession from "@/shared/auth/handleErrorSession";

export const useDelDeal = (
  closeModalFn: Dispatch<SetStateAction<void>>,
  type: DealType,
  ownerId: string
) => {
  const { queryClient, authUser } = useFormSubmission();
  return useMutation({
    mutationFn: async (nealId: string) => {
      await checkAuthorization(authUser?.id);

      return await deleteDeal(nealId, ownerId, type);
    },
    onSuccess: (data, dealId) => {
      data.managers.forEach((manager) => {
        queryClient.invalidateQueries({
          queryKey: [`${type.toLowerCase()}s`, manager.userId],
        });
      });

      queryClient.invalidateQueries({
        queryKey: [`${type.toLowerCase()}s`, ownerId],
      });

      queryClient.invalidateQueries({
        queryKey: [`${type.toLowerCase()}`, dealId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", Number(authUser?.departmentId)],
      });

      closeModalFn();
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  });
};

export const useMutationUpdateProject = (
  dealId: string,
  userId: string,
  close: () => void,
  isInvalidate: boolean = false
) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: (data: ProjectSchema) => {
      const formData = {
        ...data,
        dateRequest: data.dateRequest ? new Date(data.dateRequest) : new Date(),
        email: data.email || "",
        phone: data.phone || "",
        deliveryType: data.deliveryType as DeliveryProject,
        dealStatus: data.dealStatus as StatusProject,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionProject,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        amountPurchase: data.amountPurchase
          ? parseFloat(
              data.amountPurchase.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        amountWork: data.amountWork
          ? parseFloat(
              data.amountWork.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        delta: data.delta
          ? parseFloat(
              data.delta.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        managersIds: data.managersIds,
      };

      return handleMutationWithAuthCheck<
        ProjectWithManagersIds,
        ProjectWithoutDateCreateAndUpdate | null
      >(updateProject, formData, authUser, isSubmittingRef);
    },
    onError: (error) => {
    handleErrorSession(error)
    },
    onSuccess: (_, variables) => {
      close();

      const previousData = queryClient.getQueryData<ProjectResponse>([
        "project",
        dealId,
      ]);

      // 2. Сравниваем изменения в менеджерах (опционально)
      const prevManagers =
        previousData?.managers?.map((m) => m.id).sort() || [];
      const currManagers =
        variables.managersIds?.map((m) => m.userId).sort() || [];

      if (isInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["project", dealId] });
      }

      // Обязательная инвалидаци
      queryClient.invalidateQueries({
        queryKey: ["orders", Number(authUser?.departmentId)],
      });

      const allManagers = [
        ...new Set([...prevManagers, ...currManagers, userId]),
      ];

      allManagers.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ["projects", id] });
        queryClient.invalidateQueries({ queryKey: ["contracts", id] });
      });
    },
  });
};

export const useMutationUpdateRetail = (
  dealId: string,
  userId: string,
  close: () => void,
  isInvalidate: boolean = false
) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: (
      data: RetailSchema
    ): Promise<RetailWithoutDateCreateAndUpdate | null | undefined> => {
      const formData = {
        ...data,
        dateRequest: data.dateRequest ? new Date(data.dateRequest) : new Date(),
        email: data.email || "",
        phone: data.phone || "",
        deliveryType: data.deliveryType as DeliveryRetail,
        dealStatus: data.dealStatus as StatusRetail,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionRetail,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        delta: data.delta
          ? parseFloat(
              data.delta.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        managersIds: data.managersIds,
      };

      return handleMutationWithAuthCheck<
        RetailWithManagersIds,
        RetailWithoutDateCreateAndUpdate | null
      >(updateRetail, formData, authUser, isSubmittingRef);
    },

    onError: (error) => {
      handleErrorSession(error)
    },
    onSuccess: (_, variables) => {
      close();

      const previousData = queryClient.getQueryData<RetailResponse>([
        "retail",
        dealId,
      ]);
      const prevManagers =
        previousData?.managers?.map((m) => m.id).sort() || [];
      const currManagers =
        variables.managersIds?.map((m) => m.userId).sort() || [];

      if (isInvalidate) {
        queryClient.invalidateQueries({ queryKey: ["retail", dealId] });
      }

      queryClient.invalidateQueries({
        queryKey: ["orders", Number(authUser?.departmentId)],
      });

      const allManagers = [
        ...new Set([...prevManagers, ...currManagers, userId]),
      ];
      allManagers.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ["retails", id] }); // ✅ Условная инвалидация
      });
    },
  });
};

export const useCreateProject = (
  reset: (values?: DeepPartial<ProjectSchema>) => void
) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: async (data: ProjectSchema) => {
      const formData = {
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        deliveryType:
          data.deliveryType === ""
            ? null
            : (data.deliveryType as DeliveryProject),
        dateRequest: data.dateRequest ? new Date(data.dateRequest) : new Date(),
        dealStatus: data.dealStatus as StatusProject,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionProject,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        amountPurchase: data.amountPurchase
          ? parseFloat(
              data.amountPurchase.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        amountWork: data.amountWork
          ? parseFloat(
              data.amountWork.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        delta: data.delta
          ? parseFloat(
              data.delta.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        managersIds: data.managersIds,
      };

      return handleMutationWithAuthCheck<
        ProjectWithoutId & { managersIds: { userId: string }[] },
        ProjectResponse
      >(createProject, formData, authUser, isSubmittingRef);
    },

    onSuccess: (data) => {
      if (!data) return;

      reset(defaultProjectValues);

      queryClient.invalidateQueries({
        queryKey: ["projects", data?.userId],
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", authUser?.departmentId],
        exact: true,
      });
    },

    onError: (error) => {
      handleErrorSession(error)
    },
  });
};

export const useCreateRetail = (
  reset: (values?: DeepPartial<RetailSchema>) => void
) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: (data: RetailSchema) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      const formData = {
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        deliveryType:
          data.deliveryType === ""
            ? null
            : (data.deliveryType as DeliveryRetail),
        dateRequest: data.dateRequest ? new Date(data.dateRequest) : new Date(),
        dealStatus: data.dealStatus as StatusRetail,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionRetail,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        delta: data.delta
          ? parseFloat(
              data.delta.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0",
        managersIds: data.managersIds,
      };

      return handleMutationWithAuthCheck<
        RetailWithoutId & { managersIds: { userId: string }[] },
        RetailResponse
      >(createRetail, formData, authUser, isSubmittingRef);
    },
    onError: (error) => {
      handleErrorSession(error)
    },
    onSuccess: (data) => {
      if (data) {
        reset(defaultRetailValues);

        queryClient.invalidateQueries({
          queryKey: ["retails", data.userId],
          exact: true,
        });

        queryClient.invalidateQueries({
          queryKey: ["orders", authUser?.departmentId],
          exact: true,
        });
      }
    },
  });
};
