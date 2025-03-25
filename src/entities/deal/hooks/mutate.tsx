import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/entities/user/ui/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import {
  createProject,
  createRetail,
  deleteDeal,
  updateProject,
  updateRetail,
} from "../api";
import {
  DeliveryProject,
  DeliveryRetail,
  DirectionProject,
  DirectionRetail,
  StatusProject,
  StatusRetail,
} from "@prisma/client";
import { ProjectSchema, RetailSchema } from "../model/schema";
import { UseFormReturn } from "react-hook-form";
import { ProjectResponse, RetailResponse } from "../types";

export const useDelDeal = (
  closeModalFn: Dispatch<SetStateAction<void>>,
  type: string
) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();
  return useMutation({
    mutationFn: async (nealId: string) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return await deleteDeal(nealId, authUser.id, type);
    },
    onSuccess: () => {
      closeModalFn();
      queryClient.invalidateQueries({
        queryKey: [`${type.toLowerCase()}s`, authUser?.id],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: [`${type.toLowerCase()}`, authUser?.id],
        exact: true,
      });
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};

export const useMutationUpdateProject = (dealId: string, close: () => void) => {
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
        email: data.email || "",
        phone: data.phone || "",
        additionalContact: data.additionalContact || "",
        userId: authUser.id,
        deliveryType: data.deliveryType as DeliveryProject,
        dateRequest: new Date(),
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
      await queryClient.cancelQueries({ queryKey: ["projects", authUser?.id] });
      await queryClient.cancelQueries({ queryKey: ["project", dealId] });

      const previousDeals = queryClient.getQueryData<ProjectResponse[]>([
        "projects",
        authUser?.id,
      ]);

      const previousDeal = queryClient.getQueryData<ProjectResponse[]>([
        "project",
        dealId,
      ]);

      queryClient.setQueryData<ProjectResponse[]>(
        ["projects", authUser?.id],
        (oldProjects) => {
          if (!oldProjects) return oldProjects;
          return oldProjects.map((p) =>
            p.id === dealId
              ? {
                  ...p,
                  ...newData,
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
      if (context?.previousDeal) {
        queryClient.setQueryData(["project", dealId], context.previousDeal);
      }
      if (context?.previousDeals) {
        queryClient.setQueryData(
          ["projects", authUser?.id],
          context.previousDeals
        );
      }
    },

    // ✅ Если успех — обновляем кэш без лишнего запроса
    onSuccess: (updatedDeal) => {
      close();

      queryClient.setQueryData(
        ["projects", authUser?.id],
        (oldProjects: ProjectResponse[] | undefined) =>
          oldProjects
            ? oldProjects.map((p) => (p.id === dealId ? updatedDeal : p))
            : oldProjects
      );

      queryClient.setQueryData(["project", dealId], updatedDeal);

      // 👇 Инвалидируем кэш, только если серверные данные могли измениться
      queryClient.invalidateQueries({
        queryKey: ["projects", authUser?.id],
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: ["project", dealId],
        exact: true,
      });
    },
  });
};

export const useMutationUpdateRetail = (dealId: string, close: () => void) => {
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
        email: data.email || "",
        phone: data.phone || "",
        additionalContact: data.additionalContact || "",
        userId: authUser.id,
        deliveryType: data.deliveryType as DeliveryRetail,
        dateRequest: new Date(),
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
      await queryClient.cancelQueries({ queryKey: ["retails", authUser?.id] });
      await queryClient.cancelQueries({ queryKey: ["retail", dealId] });

      const previousDeals = queryClient.getQueryData<RetailResponse[]>([
        "retails",
        authUser?.id,
      ]);

      const previousDeal = queryClient.getQueryData<RetailResponse[]>([
        "retail",
        dealId,
      ]);

      queryClient.setQueryData<RetailResponse[]>(
        ["retails", authUser?.id],
        (oldProjects) => {
          if (!oldProjects) return oldProjects;
          return oldProjects.map((p) =>
            p.id === dealId
              ? {
                  ...p,
                  ...newData,
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
      if (context?.previousDeal) {
        queryClient.setQueryData(["retail", dealId], context.previousDeal);
      }
      if (context?.previousDeals) {
        queryClient.setQueryData(
          ["retails", authUser?.id],
          context.previousDeals
        );
      }
    },

    // ✅ Если успех — обновляем кэш без лишнего запроса
    onSuccess: (updatedDeal) => {
      close();

      queryClient.setQueryData(
        ["retails", authUser?.id],
        (oldProjects: RetailResponse[] | undefined) =>
          oldProjects
            ? oldProjects.map((p) => (p.id === dealId ? updatedDeal : p))
            : oldProjects
      );

      queryClient.setQueryData(["retail", dealId], updatedDeal);

      // 👇 Если серверные данные могли измениться, сбрасываем кэш
      queryClient.invalidateQueries({
        queryKey: ["retails", authUser?.id],
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
        additionalContact: data.additionalContact || "",
        userId: authUser.id,
        deliveryType:
          data.deliveryType === ""
            ? null
            : (data.deliveryType as DeliveryProject),
        dateRequest: new Date(),
        dealStatus: data.dealStatus as StatusProject,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionProject,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
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
          : "0", // Преобразуем в строку
      });
    },

    onSuccess: (data) => {
      if (data) {
        // setOpen(false);
        form.reset();

        queryClient.invalidateQueries({
          queryKey: ["projects", authUser?.id],
          exact: true,
        });
      }
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
        additionalContact: data.additionalContact || "",
        userId: authUser.id,
        deliveryType:
          data.deliveryType === ""
            ? null
            : (data.deliveryType as DeliveryRetail),
        dateRequest: new Date(),
        dealStatus: data.dealStatus as StatusRetail,
        plannedDateConnection: data.plannedDateConnection
          ? new Date(data.plannedDateConnection)
          : null,
        direction: data.direction as DirectionRetail,
        amountCP: data.amountCP
          ? parseFloat(
              data.amountCP.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
        delta: data.delta
          ? parseFloat(
              data.delta.replace(/\s/g, "").replace(",", ".")
            ).toString()
          : "0", // Преобразуем в строку
      });
    },
    onError: (error) => {
      // Обработка ошибок
      console.error("Ошибка при создании проекта:", error);
      TOAST.ERROR("Ошибка при создании проекта");
    },
    onSuccess: (data) => {
      if (data) {
        // setOpen(false);

        form.reset();

        queryClient.invalidateQueries({
          queryKey: ["retails", authUser?.id],
          exact: true,
        });
      }
    },
  });
};
