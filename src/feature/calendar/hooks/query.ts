import { useQuery } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { getTelegramBotInDb } from "@/feature/telegramBot/api";

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

// export const useGetInfoChatNotificationChecked = (chatName: string) => {
//   const { authUser } = useStoreUser();

//   return useQuery({
//     queryKey: ["chatInfoChecked", authUser?.id, chatName],
//     queryFn: async () => {
//       try {
//         if (!authUser?.id) {
//           throw new Error("Пользователь не авторизован");
//         }
//         const botName = await getCalendarBotName();

//         if (!botName) {
//           throw new Error("Название бота не найдено");
//         }
//         const botInDb = await getTelegramBotInDb(
//           botName,
//           authUser.id,
//           chatName
//         );

//         if (!botInDb) {
//           return {id: null, botName, isActive: false, chatId: "", chatName: "" };
//         }
   
//         return botInDb;
//       } catch (error) {
//         throw error;
//       }
//     },
//     enabled: !!authUser?.id,
//   });
// };

export const useGetInfoChat = (chatName: string, isNeedRefech?: boolean, interval: number = 1) => {
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
          chatName
        );

        if (!botInDb) {
          return {id: null, botName, isActive: false, chatId: "", chatName: "" };
        }

        return botInDb;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!authUser?.id,
    refetchInterval:isNeedRefech ? interval * 1000 : false
  });
};
