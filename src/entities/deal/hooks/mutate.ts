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
      TOAST.ERROR((error as Error).message);
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
      });
    },

    // Оптимистичное обновление UI перед запросом
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["projects", userId] });
      await queryClient.cancelQueries({ queryKey: ["project", dealId] });

      const previousDeals = queryClient.getQueryData<ProjectResponse[]>([
        "projects",
        userId,
      ]);

      const previousDeal = queryClient.getQueryData<ProjectResponse[]>([
        "project",
        dealId,
      ]);

      queryClient.setQueryData<ProjectResponse[]>(
        ["projects", userId],
        (oldProjects) => {
          if (!oldProjects) return oldProjects;
          return oldProjects.map((p) =>
            p.id === dealId
              ? {
                  ...p,
                  ...newData,
                  dateRequest: newData.dateRequest
                    ? new Date(newData.dateRequest)
                    : new Date(),
                  direction: newData.direction as DirectionProject,
                  dealStatus: newData.dealStatus as StatusProject,
                  deliveryType: newData.deliveryType as DeliveryProject,
                  plannedDateConnection: newData.plannedDateConnection
                    ? new Date(newData.plannedDateConnection)
                    : null,
                }
              : p
          );
        }
      );

      queryClient.setQueryData<ProjectResponse>(
        ["project", dealId],
        (oldProject) => {
          if (!oldProject) return oldProject;

          return {
            ...oldProject,
            ...newData,
            dateRequest: newData.dateRequest
              ? new Date(newData.dateRequest)
              : new Date(),
            direction: newData.direction as DirectionProject,
            dealStatus: newData.dealStatus as StatusProject,
            deliveryType: newData.deliveryType as DeliveryProject,
            plannedDateConnection: newData.plannedDateConnection
              ? new Date(newData.plannedDateConnection)
              : null,
          };
        }
      );

      return { previousDeals, previousDeal };
    },

    // 🔄 Откат данных в случае ошибки
    onError: (_error, _newData, context) => {
      TOAST.ERROR((_error as Error).message);
      if (context?.previousDeal) {
        queryClient.setQueryData(["project", dealId], context.previousDeal);
      }
      if (context?.previousDeals) {
        queryClient.setQueryData(["projects", userId], context.previousDeals);
      }
    },

    // ✅ Если успех — обновляем кэш без лишнего запроса
    onSuccess: (updatedDeal) => {
      close();

      queryClient.setQueryData(
        ["projects", userId],
        (oldProjects: ProjectResponse[] | undefined) => {
          return oldProjects
            ? [
                ...oldProjects.map((p) =>
                  p.id === dealId ? { ...p, ...updatedDeal } : p
                ),
              ]
            : oldProjects;
        }
      );

      queryClient.setQueryData(["project", dealId], { ...updatedDeal });

      // 👇 Инвалидируем кэш, только если серверные данные могли измениться
      queryClient.invalidateQueries({
        queryKey: ["projects", userId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["project", dealId],
        exact: true,
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
        id: dealId,
        ...data,
        dateRequest: data.dateRequest ? new Date(data.dateRequest) : new Date(),
        email: data.email || "",
        phone: data.phone || "",
        userId,
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
      });
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["retails", userId] });
      await queryClient.cancelQueries({ queryKey: ["retail", dealId] });

      const previousDeals = queryClient.getQueryData<RetailResponse[]>([
        "retails",
        userId,
      ]);

      const previousDeal = queryClient.getQueryData<RetailResponse[]>([
        "retail",
        dealId,
      ]);

      queryClient.setQueryData<RetailResponse[]>(
        ["retails", userId],
        (oldProjects) => {
          if (!oldProjects) return oldProjects;
          return oldProjects.map((p) =>
            p.id === dealId
              ? {
                  ...p,
                  ...newData,
                  dateRequest: newData.dateRequest
                    ? new Date(newData.dateRequest)
                    : new Date(),
                  direction: newData.direction as DirectionRetail,
                  dealStatus: newData.dealStatus as StatusRetail,
                  deliveryType: newData.deliveryType as DeliveryRetail,
                  plannedDateConnection: newData.plannedDateConnection
                    ? new Date(newData.plannedDateConnection)
                    : null,
                }
              : p
          );
        }
      );

      queryClient.setQueryData<RetailResponse>(
        ["retail", dealId],
        (oldProject) => {
          if (!oldProject) return oldProject;

          return {
            ...oldProject,
            ...newData,
            dateRequest: newData.dateRequest
              ? new Date(newData.dateRequest)
              : new Date(),
            direction: newData.direction as DirectionRetail,
            dealStatus: newData.dealStatus as StatusRetail,
            deliveryType: newData.deliveryType as DeliveryRetail,
            plannedDateConnection: newData.plannedDateConnection
              ? new Date(newData.plannedDateConnection)
              : null,
          };
        }
      );

      return { previousDeals, previousDeal };
    },
    onError: (_error, _newData, context) => {
      TOAST.ERROR((_error as Error).message);
      if (context?.previousDeal) {
        queryClient.setQueryData(["retail", dealId], context.previousDeal);
      }
      if (context?.previousDeals) {
        queryClient.setQueryData(["retails", userId], context.previousDeals);
      }
    },

    // ✅ Если успех — обновляем кэш без лишнего запроса
    onSuccess: (updatedDeal) => {
      close();

      queryClient.setQueryData(
        ["retails", userId],
        (oldProjects: RetailResponse[] | undefined) =>
          oldProjects
            ? oldProjects.map((p) => (p.id === dealId ? updatedDeal : p))
            : oldProjects
      );

      queryClient.setQueryData(["retail", dealId], updatedDeal);

      // 👇 Если серверные данные могли измениться, сбрасываем кэш
      queryClient.invalidateQueries({
        queryKey: ["retails", userId],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["retail", dealId],
        exact: true,
      });
    },
  });
};

export const useCreateProject = (form: UseFormReturn<ProjectSchema>) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();
  return useMutation({
    mutationFn: (data: ProjectSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return createProject({
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        userId: authUser.id,
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
      });
    },

    onSuccess: (data) => {
      if (data) {
        // setOpen(false);
        form.reset(defaultProjectValues);

        queryClient.invalidateQueries({
          queryKey: ["projects", authUser?.id],
          exact: true,
        });
      }
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};

export const useCreateRetail = (form: UseFormReturn<RetailSchema>) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: (data: RetailSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return createRetail({
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        userId: authUser.id,
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
      });
    },
    onError: (error) => {
      console.error("Ошибка при создании проекта:", error);
      TOAST.ERROR("Ошибка при создании проекта");
    },
    onSuccess: (data) => {
      if (data) {
        form.reset(defaultRetailValues);

        queryClient.invalidateQueries({
          queryKey: ["retails", authUser?.id],
          exact: true,
        });
      }
    },
  });
};
