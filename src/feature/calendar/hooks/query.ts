import { useQuery } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { getTelegramChatBotInDb } from "@/shared/api/getTelegramChatBotInDb";

import {
  getAllEventsCalendar,
  getEventsCalendarUser,
  getEventsCalendarUserToday,
} from "../api";

export const useGetEventsCalendarUser = () => {
  const { authUser } = useStoreUser();

  return useQuery({
    queryKey: ["eventsCalendar", authUser?.id],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getEventsCalendarUser();
      } catch (error) {
        throw error;
      }
    },
    enabled: !!authUser?.id,
  });
};

export const useGetEventsCalendarUserToday = () => {
  const { authUser } = useStoreUser();

  return useQuery({
    queryKey: ["eventsCalendarToday", authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return await getEventsCalendarUserToday();
    },
    enabled: !!authUser?.id,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useGetAllEvents = () => {
  const { authUser } = useStoreUser();

  return useQuery({
    queryKey: ["allEvents", authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return await getAllEventsCalendar();
    },
    enabled: !!authUser?.id,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useGetInfoChat = (botName: string) => {
  const { authUser } = useStoreUser();

  return useQuery({
    queryKey: ["chatInfo", authUser?.id, botName],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }

        if (!botName) {
          throw new Error("Название бота не найдено");
        }

        const botInDb = await getTelegramChatBotInDb(botName, authUser.id);

        return (
          botInDb || {
            id: null,
            botName,
            isActive: false,
            chatId: "",
            chatName: "",
            description: "",
          }
        );
      } catch (error) {
        console.error("Error in useGetInfoChat:", error);
        return {
          id: null,
          botName,
          isActive: false,
          chatId: "",
          chatName: "",
          description: "",
        };
      }
    },
    enabled: !!authUser?.id && !!botName,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
