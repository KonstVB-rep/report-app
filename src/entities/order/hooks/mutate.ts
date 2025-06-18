import { OrderResponse } from "./../types";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { createOrder, delOrder, updateOrder } from "../api";
import { OrderSchema } from "../model/shema";
import { defaultOrderValues } from "../lib/constants";
import { Dispatch, SetStateAction } from "react";

export const useCreateOrder = (form: UseFormReturn<OrderSchema>) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: (data: OrderSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      return createOrder({
        ...data,
        email: data.email || "",
        phone: data.phone || "",
        dateRequest: data.dateRequest ? new Date(data.dateRequest) : new Date(),
        resource: data.resource ?? null,
      });
    },
    onError: (error) => {
      console.error("Ошибка при создании проекта:", error);
      TOAST.ERROR("Ошибка при создании проекта");
    },
    onSuccess: (data) => {
      if (data) {
        form.reset(defaultOrderValues);

        queryClient.invalidateQueries({
          queryKey: ["orders", authUser?.departmentId],
          exact: true,
        });
      }
    },
  });
};


export const useDelOrder = (
  closeModalFn: Dispatch<SetStateAction<void>>,
) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: async (orderId: string) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      return await delOrder(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`orders`, authUser?.departmentId],
      });
      closeModalFn();
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};

export const useUpdateOrder = (
   closeModalFn: Dispatch<SetStateAction<void>>,
) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: async (data:{orderId: string, order: OrderResponse}) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      const {orderId, order} = data;

      return await updateOrder(orderId, order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`orders`, authUser?.departmentId],
      });
      closeModalFn();
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
}