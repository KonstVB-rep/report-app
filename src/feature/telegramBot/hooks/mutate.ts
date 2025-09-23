import { TelegramBot, UserTelegramChat } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { usePathname } from "next/navigation";

import { getQueryClient } from "@/app/provider/query-provider";
import {
  deleteBot,
  deleteChat,
  toggleSubscribeChatBot,
} from "@/entities/tgBot/api";
import { ChatFormData } from "@/entities/tgBot/types";
import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import { logout } from "@/shared/auth/logout";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";
import { ActionResponse } from "@/shared/types";

import { saveChat, updateChat } from "../actions/user-chat";

const queryClient = getQueryClient();

export const useCreateChatBot = (
  onSetState: (data: ActionResponse<ChatFormData>) => void
) => {
  const { authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (chatData: FormData) => {
      return handleMutationWithAuthCheck<
        FormData,
        ActionResponse<ChatFormData>
      >(saveChat, chatData, authUser, isSubmittingRef);
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      if (!data.success) {
        onSetState(data);
        TOAST.ERROR(data.message);
        return;
      }
      onSetState(data);
      TOAST.SUCCESS(data.message);

      //   queryClient.invalidateQueries({
      //     queryKey: ["chatInfoChecked", authUser?.id, data.result.chatName],
      //   });
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

export const useDeleteChat = () => {
  const { authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (data: { chatId: string; botName: string }) => {
      return handleMutationWithAuthCheck<
        { chatId: string; botName: string },
        UserTelegramChat
      >(deleteChat, data, authUser, isSubmittingRef);
    },

    onSuccess: (data) => {
      TOAST.SUCCESS(`Чат ${data.chatName} успешно удален`);

      queryClient.invalidateQueries({
        queryKey: ["chats", data.botId],
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
          : "Ошибка при удалении бота";

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useDeleteBot = () => {
  const { authUser, isSubmittingRef } = useFormSubmission();
  const pathName = usePathname();

  return useMutation({
    mutationFn: async (botName: string) => {
      return handleMutationWithAuthCheck<
        { botName: string; pathName: string },
        TelegramBot
      >(deleteBot, { botName, pathName }, authUser, isSubmittingRef);
    },
    onSuccess: (data) => {
      TOAST.SUCCESS(`Чат ${data.botName} успешно удален`);
    },
    onError: (error, variables, context) => {
      const err = error as Error & { status?: number };

      if (err.status === 401 || err.message === "Сессия истекла") {
        TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.");
        logout();
        return;
      }

      const errorMessage =
        err.message === "Failed to fetch"
          ? "Ошибка соединения"
          : "Ошибка при удалении бота";

      TOAST.ERROR(errorMessage);
    },
  });
};

export const useUpdateChatBot = (
  onSetState: (data: ActionResponse<UserTelegramChat>) => void
) => {
  const { authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (chatData: FormData) => {
      return handleMutationWithAuthCheck<
        FormData,
        ActionResponse<UserTelegramChat>
      >(updateChat, chatData, authUser, isSubmittingRef);
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      if (!data.success) {
        onSetState(data);
        TOAST.ERROR(data.message);
        return;
      }
      onSetState(data);
      TOAST.SUCCESS(data.message);

      //   queryClient.invalidateQueries({
      //     queryKey: ["chatInfoChecked", authUser?.id, data.result.chatName],
      //   });
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

export const useToggleSudscribeChatBot = () => {
  const { authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (chatData: {
      botId: string;
      chatId: string;
      isActive: boolean;
    }) => {
      return handleMutationWithAuthCheck<
        { botId: string; chatId: string; isActive: boolean },
        UserTelegramChat
      >(toggleSubscribeChatBot, chatData, authUser, isSubmittingRef);
    },
    onSuccess: () => {
      TOAST.SUCCESS("Вы подписались на чат бота");

      // queryClient.invalidateQueries({
      //   queryKey: ["chatInfoChecked", authUser?.id, data.result.chatName],
      // });
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
