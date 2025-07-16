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
import { DeepPartial } from "react-hook-form";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { logout } from "@/feature/auth/logout";
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
      const err = error as Error & { status?: number };
      console.error("Mutation error:", err);

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch" ? "Ошибка соединения" : err.message;

      TOAST.ERROR(errorMessage);
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
      });
    },
    onError: (error) => {
      const err = error as Error & { status?: number };

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch" ? "Ошибка соединения" : err.message;

      TOAST.ERROR(errorMessage);
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

      // Обязательная инвалидация
      queryClient.invalidateQueries({ queryKey: ["project", dealId] });
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

    onError: (error) => {
      const err = error as Error & { status?: number };
      console.error("Mutation error:", err);

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch" ? "Ошибка соединения" : err.message;

      TOAST.ERROR(errorMessage);
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

      queryClient.invalidateQueries({ queryKey: ["retail", dealId] }); // ✅ Обязательная инвалидация
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

export const useCreateProject = (reset: (values?: DeepPartial<ProjectSchema>) => void) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();
  // const router = useRouter(); // Добавляем useRouter для навигации

  return useMutation({
    mutationFn: async (data: ProjectSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      try {
        return await createProject({
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
        });
      } catch (error) {
        console.error("Error in mutationFn:", error);
        throw error;
      }
    },

    onSuccess: (data) => {
      if (!data) return;

      reset(defaultProjectValues);

      queryClient.invalidateQueries({
        queryKey: ["projects", authUser?.id],
        exact: true,
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", authUser?.departmentId],
        exact: true,
      });
    },

    onError: (error) => {
      const err = error as Error & { status?: number };
      console.error("Mutation error:", err);

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch" ? "Ошибка соединения" : err.message;

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useCreateRetail = (reset: (values?: DeepPartial<RetailSchema>) => void) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: (data: RetailSchema) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      return createRetail({
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
      });
    },
    onError: (error) => {
      const err = error as Error & { status?: number };
      console.error("Mutation error:", err);

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch" ? "Ошибка соединения" : err.message;

      TOAST.ERROR(errorMessage);
    },
    onSuccess: (data) => {
      if (data) {
        reset(defaultRetailValues);

        // queryClient.invalidateQueries({
        //   queryKey: ["retails", data.userId],
        //   exact: true,
        // });

        queryClient.invalidateQueries({
          queryKey: ["retails", authUser?.id],
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
