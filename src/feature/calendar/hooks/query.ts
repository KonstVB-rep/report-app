import { useQuery } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";

import { getCalendarBotName, getEventsCalendarUser, getEventsCalendarUserToday } from "../api";
import { getTelegramBotInDb } from "@/feature/telegramBot/api";

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
        console.log(error, "Ошибка useGetAllRetails");
        throw error;
      }
    },
    retry: !!authUser?.id,
  });
};

export const useGetEventsCalendarUserToday = () => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["eventsCalendarToday", authUser?.id],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getEventsCalendarUserToday();
      } catch (error) {
        console.log(error, "Ошибка useGetAllRetails");
        throw error;
      }
    },
    retry: !!authUser?.id,
  });
};

export const useGetInfoChat = (chatName: string) => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["chatInfo", authUser?.id, chatName],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }

        const botName = await getCalendarBotName();

        if (!botName) {
          throw new Error("Название бота не найдено");
        }
        const botInDb = await getTelegramBotInDb(
          botName,
          authUser.id,
          "calendarChat"
        );
        if (!botInDb) {
          return {botName, isActive: false, chatId: "", chatName: ""};
        }

        return botInDb || {};
      } catch (error) {
        throw error;
      }
    },
    retry: !!authUser?.id,
  });
};
