import {
  DealType,
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { arraysEqual } from "@/shared/lib/helpers/arraysEqual";
import { TOAST } from "@/shared/ui/Toast";

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
import { ProjectResponse, RetailResponse } from "../types";

export const useDelDeal = (
  closeModalFn: Dispatch<SetStateAction<void>>,
  type: DealType,
  ownerId: string
) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: async (nealId: string) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      return await deleteDeal(nealId, ownerId, type);
    },
    onSuccess: (_, dealId) => {
      queryClient.invalidateQueries({
        queryKey: [`${type.toLowerCase()}s`, ownerId],
      });
      queryClient.invalidateQueries({
        queryKey: [`${type.toLowerCase()}`, dealId],
      });

      closeModalFn();
    },
    onError: (error) => {
       if ((error as Error).message === "Failed to fetch") {
        TOAST.ERROR("Не удалось получить данные");
      } else {
        TOAST.ERROR((error as Error).message);
      }
    },
  });
};

export const useMutationUpdateProject = (
  dealId: string,
  userId: string,
  close: () => void
) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();
  return useMutation({
    mutationFn: (data: ProjectSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return updateProject({
        ...data,
        id: dealId,
        dateRequest: data.dateRequest ? new Date(data.dateRequest) : new Date(),
        email: data.email || "",
        phone: data.phone || "",
        userId,
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
      });
    },
    onError: (_error) => {
      TOAST.ERROR((_error as Error).message);
    },
    onSuccess: (_, variables) => {
      close();
      TOAST.SUCCESS("Данные обновлены");

      const previousData = queryClient.getQueryData<ProjectResponse>([
        "project",
        dealId,
      ]);

      // 2. Сравниваем изменения в менеджерах (опционально)
      const prevManagers =
        previousData?.managers?.map((m) => m.id).sort() || [];
      const currManagers =
        variables.managersIds?.map((m) => m.userId).sort() || [];

      //  сравнение
      const managersChanged = !arraysEqual(prevManagers, currManagers);

      // Обязательная инвалидация
      queryClient.invalidateQueries({ queryKey: ["project", dealId] });
      queryClient.invalidateQueries({ queryKey: ["contracts", userId] });

      // Условная инвалидация менеджеров
      if (managersChanged) {
        const allManagers = [
          ...new Set([...prevManagers, ...currManagers, userId]),
        ];

        allManagers.forEach((id) => {
          queryClient.invalidateQueries({ queryKey: ["projects", id] });
        });
      }
    },
  });
};

export const useMutationUpdateRetail = (
  dealId: string,
  userId: string,
  close: () => void
) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();
  return useMutation({
    mutationFn: (data: RetailSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return updateRetail({
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
      });
    },
  
    onError: (_error) => {
      TOAST.ERROR((_error as Error).message);
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
      const managersChanged = !arraysEqual(prevManagers, currManagers);

      queryClient.invalidateQueries({ queryKey: ["retail", dealId] }); // ✅ Обязательная инвалидация

      if (managersChanged) {
        const allManagers = [
          ...new Set([...prevManagers, ...currManagers, userId]),
        ];
        allManagers.forEach((id) => {
          queryClient.invalidateQueries({ queryKey: ["retails", id] }); // ✅ Условная инвалидация
        });
      }
    },
  });
};

export const useCreateProject = (
  form: UseFormReturn<ProjectSchema>,
  ownerId: string
) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();
  return useMutation({
    mutationFn: (data: ProjectSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return createProject(
        {
          ...data,
          email: data.email || "",
          phone: data.phone || "",
          deliveryType:
            data.deliveryType === ""
              ? null
              : (data.deliveryType as DeliveryProject),
          dateRequest: data.dateRequest
            ? new Date(data.dateRequest)
            : new Date(),
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
        },
        ownerId
      );
    },

    onSuccess: (data) => {
      if (data) {
        form.reset(defaultProjectValues);

        queryClient.invalidateQueries({
          queryKey: ["projects", data.userId],
          exact: true,
        });

        queryClient.invalidateQueries({
          queryKey: ["orders", authUser?.departmentId],
          exact: true,
        });
      }
    },
    onError: (error) => {
      if ((error as Error).message === "Failed to fetch") {
        TOAST.ERROR("Не удалось получить данные");
      } else {
        TOAST.ERROR((error as Error).message);
      }
    },
  });
};

export const useCreateRetail = (
  form: UseFormReturn<RetailSchema>,
  ownerId: string
) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: (data: RetailSchema) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      return createRetail(
        {
          ...data,
          email: data.email || "",
          phone: data.phone || "",
          deliveryType:
            data.deliveryType === ""
              ? null
              : (data.deliveryType as DeliveryRetail),
          dateRequest: data.dateRequest
            ? new Date(data.dateRequest)
            : new Date(),
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
        },
        ownerId
      );
    },
    onError: (error) => {
      console.error("Ошибка при создании сделки:", error);
      TOAST.ERROR("Ошибка при создании сделки");
    },
    onSuccess: (data) => {
      if (data) {
        form.reset(defaultRetailValues);

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
