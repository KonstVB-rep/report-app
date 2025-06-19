import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import { StatusOrder } from "@prisma/client";
import { createOrder, delOrder, updateOrder, updateOrderOnly } from "../api";
import { defaultOrderValues } from "../lib/constants";
import { OrderSchema } from "../model/shema";
import { OrderResponse } from "./../types";

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

        queryClient.invalidateQueries({
          queryKey: ["orders-not-at-work-user", authUser?.id],
          exact: true,
        });
      // if(!NOT_MANAGERS_POSITIONS_KEYS.includes(authUser?.position as string))
      //   queryClient.invalidateQueries({
      //     queryKey: ["orders-not-at-work-user", authUser?.id],
      //     exact: true,
      //   });
      }

      if (data.telegramError) {
        TOAST.ERROR(`Ошибка уведомления: ${data.telegramError}`);
        console.warn(
          "Ошибка отправки уведомления в Telegram:",
          data.telegramError
        );
      }
    },
  });
};

export const useDelOrder = (closeModalFn: Dispatch<SetStateAction<void>>) => {
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
  closeModalFn: Dispatch<SetStateAction<void>>
) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: async (data: { orderId: string; order: OrderResponse }) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      const { orderId, order } = data;

      return await updateOrder(orderId, order);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: [`orders`, authUser?.departmentId],
        });
        closeModalFn();
      }

      if (data.telegramError) {
        TOAST.ERROR(`Ошибка уведомления: ${data.telegramError}`);
        console.warn(
          "Ошибка отправки уведомления в Telegram:",
          data.telegramError
        );
      }
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};


export const useUpdateOrderStatusAtWork = () => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: async (data: OrderResponse) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      return await updateOrderOnly({...data, orderStatus: StatusOrder.AT_WORK});
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: [`orders`, authUser?.departmentId],
        });
      }

         queryClient.invalidateQueries({
          queryKey: ["orders-not-at-work-user", authUser?.id],
          exact: true,
        });

       // if(!NOT_MANAGERS_POSITIONS_KEYS.includes(authUser?.position as string))
      //   queryClient.invalidateQueries({
      //     queryKey: ["orders-not-at-work-user", authUser?.id],
      //     exact: true,
      //   });
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};
