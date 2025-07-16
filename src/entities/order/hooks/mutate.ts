import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Dispatch, SetStateAction } from "react";
import { DeepPartial } from "react-hook-form";

import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { NOT_MANAGERS_POSITIONS_KEYS } from "@/entities/department/lib/constants";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { logout } from "@/feature/auth/logout";
import { TOAST } from "@/shared/ui/Toast";

import { createOrder, delOrder, updateOrder } from "../api";
import { defaultOrderValues } from "../lib/constants";
import { OrderSchema } from "../model/shema";
import { OrderResponse } from "./../types";

export const useCreateOrder = (
  reset: (values?: DeepPartial<OrderSchema>) => void
) => {
  const queryClient = useQueryClient();
  const { authUser } = useStoreUser();

  return useMutation({
    mutationFn: (data: OrderSchema) => {
      if (!authUser?.id) {
        throw new Error("User ID is missing");
      }

      const orderDate = new Date(data.dateRequest);

      const [hour, min] = new Date()
        .toLocaleTimeString("Ru-ru", { hour: "2-digit", minute: "2-digit" })
        .split(":");
      orderDate.setHours(Number(hour));
      orderDate.setMinutes(Number(min));

      const formattDateReq = format(orderDate.toString(), "yyyy.MM.d HH:mm", {
        locale: ru,
      });

      return createOrder({
        ...data,
        contact: data.contact || "",
        email: data.email || "",
        phone: data.phone || "",
        dateRequest: data.dateRequest ? new Date(formattDateReq) : new Date(),
        resource: data.resource ?? null,
        comments: data.comments || null,
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
        err.message === "Failed to fetch"
          ? "Ошибка соединения"
          : "Ошибка при создании заявки";

      TOAST.ERROR(errorMessage);
    },
    onSuccess: (data) => {
      if (data) {
        reset(defaultOrderValues);

        queryClient.invalidateQueries({
          queryKey: ["orders", authUser?.departmentId],
          exact: true,
        });

        if (!NOT_MANAGERS_POSITIONS_KEYS.includes(authUser?.position as string))
          queryClient.invalidateQueries({
            queryKey: ["orders-not-at-work-user", authUser?.id],
            exact: true,
          });
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
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: [`orders`, authUser?.departmentId],
        });

        if (data.telegramError) {
          TOAST.ERROR(`Ошибка уведомления: ${data.telegramError}`);
          console.warn(
            "Ошибка отправки уведомления в Telegram:",
            data.telegramError
          );
        }
      }
      closeModalFn();
    },
    onError: (error) => {
      const err = error as Error & { status?: number };

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch"
          ? "Ошибка соединения"
          : "Ошибка при удалении заявки";

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useUpdateOrder = (closeModalFn: () => void) => {
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
      const err = error as Error & { status?: number };

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch"
          ? "Ошибка соединения"
          : "Ошибка при обновлении заявки";

      TOAST.ERROR(errorMessage);
    },
  });
};

// export const useUpdateOrderStatusAtWork = () => {
//   const queryClient = useQueryClient();
//   const { authUser } = useStoreUser();

//   return useMutation({
//     mutationFn: async (data: OrderResponse) => {
//       if (!authUser?.id) {
//         throw new Error("Пользователь не авторизован");
//       }

//       return await updateOrderOnly({
//         ...data,
//         orderStatus: StatusOrder.AT_WORK,
//       });
//     },
//     onSuccess: (data) => {
//       if (data) {
//         queryClient.invalidateQueries({
//           queryKey: [`orders`, authUser?.departmentId],
//         });
//       }

//       if(!NOT_MANAGERS_POSITIONS_KEYS.includes(authUser?.position as string))
//         queryClient.invalidateQueries({
//           queryKey: ["orders-not-at-work-user", authUser?.id],
//           exact: true,
//         });
//     },
//     onError: (error) => {
//       TOAST.ERROR((error as Error).message);
//     },
//   });
// };
