import { useMutation, useQueryClient } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import { createEventCalendar, updateEventCalendar, deleteEventCalendar } from "../api";

export const useCreateEventCalendar = (closeModal: () => void) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: { title: string; start: string; end: string }) => {
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
      TOAST.SUCCESS("Событие успешно удалено");
    },
    onError: (error) => {
      console.log(error);
      TOAST.ERROR("Произошла ошибка при попытке удаления события");
    },
  });
};
