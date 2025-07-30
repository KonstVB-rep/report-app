import { useQuery } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { getTelegramBotInDb } from "@/shared/api/getTelegramBotInDb";

import {
  getCalendarBotName,
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
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }

        return await getEventsCalendarUserToday();
      } catch (error) {
        throw error;
      }
    },
    enabled: !!authUser?.id,
  });
};
export const useGetInfoChat = (
  chatName: string,
  isNeedRefetch?: boolean,
  interval: number = 1
) => {
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

        const botInDb = await getTelegramBotInDb(botName, authUser.id);

        if (!botInDb) {
          return {
            id: null,
            botName,
            isActive: false,
            chatId: "",
            chatName: "",
          };
        }

        return botInDb;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!authUser?.id && !!chatName, // не запускаем запрос без пользователя и имени чата
    refetchInterval: isNeedRefetch ? interval * 1000 : false, // включаем периодический рефетч если нужно
    staleTime: 5 * 60 * 1000, // можно задать, чтобы данные были свежими 5 минут (настройка для оптимизации)
    gcTime: 10 * 60 * 1000, // кэшируем данные 10 минут
  });
};
