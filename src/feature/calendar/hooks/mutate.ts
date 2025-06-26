import { useMutation, useQueryClient } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
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
      console.log(error);
      TOAST.ERROR("Произошла ошибка при добавлении события");
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
      console.log(error);
      TOAST.ERROR("Произошла ошибка при обновлении события");
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
      console.log(error);
      TOAST.ERROR("Произошла ошибка при попытке удаления события");
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
      console.log(error);
      TOAST.ERROR("Произошла ошибка при попытке удаления события");
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
      console.log(error);
      TOAST.ERROR("Произошла ошибка при попытке удаления события");
    },
  });
};
