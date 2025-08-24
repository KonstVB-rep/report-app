import { useMutation } from "@tanstack/react-query";

import { toggleSubscribeChatBot } from "@/feature/createTelegramChatBot/api";
import {
  ChatBotType,
  ResponseChatBotType,
} from "@/feature/createTelegramChatBot/type";
import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import { logout } from "@/shared/auth/logout";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";

import {
  createEventCalendar,
  deleteEventCalendar,
  updateEventCalendar,
} from "../api";
import { EventDataType, EventResponse } from "../types";

export const useCreateEventCalendar = (closeModal: () => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: (EventDataType: EventDataType) => {
      return handleMutationWithAuthCheck<EventDataType, EventResponse>(
        createEventCalendar,
        EventDataType,
        authUser,
        isSubmittingRef
      );
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
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: (EventDataType: EventDataType) => {
      return handleMutationWithAuthCheck<EventDataType, EventResponse>(
        updateEventCalendar,
        EventDataType,
        authUser,
        isSubmittingRef
      );
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
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (id: string) => {
      return handleMutationWithAuthCheck<{ id: string }, EventResponse>(
        deleteEventCalendar,
        { id },
        authUser,
        isSubmittingRef
      );
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
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (chatData: ChatBotType) => {
      const data = {
        chatName: chatData.chatName,
        chatId: chatData.chatId,
        isActive: chatData.isActive,
      };

      return handleMutationWithAuthCheck<ChatBotType, ResponseChatBotType>(
        toggleSubscribeChatBot,
        data,
        authUser,
        isSubmittingRef
      );
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
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
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (chatData: {
      botId: string | null;
      chatId: string;
      isActive: boolean;
    }) => {
      if (!chatData.botId) return;

      const data = {
        chatName: chatData.botId,
        chatId: chatData.chatId,
        isActive: chatData.isActive,
      };
      return handleMutationWithAuthCheck<ChatBotType, ResponseChatBotType>(
        toggleSubscribeChatBot,
        data,
        authUser,
        isSubmittingRef
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
