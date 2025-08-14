import { useMutation } from "@tanstack/react-query";

import { Dispatch, SetStateAction } from "react";
import { DeepPartial } from "react-hook-form";

import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { NOT_MANAGERS_POSITIONS_KEYS } from "@/entities/department/lib/constants";
import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";
import { checkAuthorization } from "@/shared/lib/helpers/checkAuthorization";
import { TOAST } from "@/shared/ui/Toast";

import { createOrder, delOrder, updateOrder } from "../api";
import { defaultOrderValues } from "../lib/constants";
import { OrderSchema } from "../model/shema";
import {
  OrderCreateData,
  OrderDataReturn,
  OrderResponse,
  UpdateOrderData,
} from "./../types";
import handleErrorSession from "@/shared/auth/handleErrorSession";

export const useCreateOrder = (
  reset: (values?: DeepPartial<OrderSchema>) => void
) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (data: OrderSchema) => {
      const orderDate = new Date(data.dateRequest);

      const [hour, min] = new Date()
        .toLocaleTimeString("Ru-ru", { hour: "2-digit", minute: "2-digit" })
        .split(":");
      orderDate.setHours(Number(hour));
      orderDate.setMinutes(Number(min));

      const formattDateReq = format(orderDate.toString(), "yyyy.MM.d HH:mm", {
        locale: ru,
      });

      const formData = {
        ...data,
        contact: data.contact || "",
        email: data.email || "",
        phone: data.phone || "",
        dateRequest: data.dateRequest ? new Date(formattDateReq) : new Date(),
        resource: data.resource ?? null,
        comments: data.comments || null,
      };

      return handleMutationWithAuthCheck<
        OrderCreateData,
        { order: OrderResponse; telegramError: string | undefined }
      >(createOrder, formData, authUser, isSubmittingRef);
    },
    onError: (error) => {
    handleErrorSession(error)
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

      if (data?.telegramError) {
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
  const { queryClient, authUser } = useFormSubmission();

  return useMutation({
    mutationFn: async (orderId: string) => {
      await checkAuthorization(authUser?.id);

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
      handleErrorSession(error)
    },
  });
};

export const useUpdateOrder = (closeModalFn: () => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (data: { orderId: string; order: OrderResponse }) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      const { orderId, order } = data;

      const formData = { orderId, data: order };

      return handleMutationWithAuthCheck<UpdateOrderData, OrderDataReturn>(
        updateOrder,
        formData,
        authUser,
        isSubmittingRef
      );
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: [`orders`, authUser?.departmentId],
        });
        closeModalFn();
      }

      if (data?.telegramError) {
        TOAST.ERROR(`Ошибка уведомления: ${data.telegramError}`);
        console.warn(
          "Ошибка отправки уведомления в Telegram:",
          data.telegramError
        );
      }
    },
    onError: (error) => {
      handleErrorSession(error)
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
