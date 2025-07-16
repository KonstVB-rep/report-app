import { useMutation, useQueryClient } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { logout } from "@/feature/auth/logout";
import { toggleSubscribeChatBot } from "@/feature/calendar/api/calendar-bot/api";
import { TOAST } from "@/shared/ui/Toast";

import {
  createEventCalendar,
  deleteEventCalendar,
  updateEventCalendar,
} from "../api";

export const useCreateEventCalendar = (closeModal: () => void) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: {
      title: string;
      start: string;
      end: string;
      allDay?: boolean;
    }) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return createEventCalendar(eventData);
    },
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({
        queryKey: ["eventsCalendar", authUser?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventsCalendarToday", authUser?.id],
      });
      TOAST.SUCCESS("Событие успешно добавлено в календарь");
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
          : "Ошибка при добавлении события";

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useUpdateEventCalendar = (closeModal: () => void) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: {
      id: string;
      title: string;
      start: string;
      end: string;
      allDay?: boolean;
    }) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return updateEventCalendar(eventData);
    },
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({
        queryKey: ["eventsCalendar", authUser?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventsCalendarToday", authUser?.id],
      });
      TOAST.SUCCESS("Событие успешно обновлено");
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
          : "Ошибка при обновлении события";

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useDeleteEventCalendar = (closeModal: () => void) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return deleteEventCalendar(id);
    },
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({
        queryKey: ["eventsCalendar", authUser?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["eventsCalendarToday", authUser?.id],
      });
      TOAST.SUCCESS("Событие успешно удалено");
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
          : "Ошибка при удалении события";

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useCreateChatBot = () => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatData: { chatName: string; isActive: boolean }) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return await toggleSubscribeChatBot(
        chatData.chatName,
        authUser.id,
        chatData.isActive
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["chatInfo", authUser?.id, data.chatName],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatInfoChecked", authUser?.id, data.chatName],
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
          : "Ошибка при подписке на чат бот";

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useUpdateChatBot = () => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatData: {
      botId: string | null;
      isActive: boolean;
    }) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      if (!chatData.botId) return;
      return await toggleSubscribeChatBot(
        chatData.botId,
        authUser.id,
        chatData.isActive
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["chatInfo", authUser?.id, data?.chatName],
      });
      queryClient.invalidateQueries({
        queryKey: ["chatInfoChecked", authUser?.id, data?.chatName],
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
          : "Ошибка при обновлении статуса бота";

      TOAST.ERROR(errorMessage);
    },
  });
};
