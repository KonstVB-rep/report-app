import { useState } from "react";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/custom-components/ui/Toast";
// import { checkAuthorization } from "@/shared/lib/helpers/checkAuthorization";

import { useToggleSudscribeChatBot } from "@/feature/telegramBot/hooks/mutate";

import { useGetInfoChat } from "../../calendar/hooks/query";
import { sendNotify } from "../actions/send-notify";


const useChatBot = (botName: string) => {
  const { authUser } = useStoreUser();

  const [isFetch, setIsFetch] = useState(false);

  const { data: bot, isFetching, refetch } = useGetInfoChat(botName);

  const isFetchingRequest = isFetching || isFetch;

  const { mutate: updateStatusChatBot } = useToggleSudscribeChatBot();

  // const handleUnsubscribeChatBot = async (chatId: string) => {
  //   if (!bot?.botName) return;

  //   try {
  //     await checkAuthorization(authUser?.id);
  //     setIsFetch(true);
  //     updateStatusChatBot({
  //       botId: bot?.id || "",
  //       chatId: String(chatId),
  //       isActive: false,
  //     });
  //     if (chatId) {
  //       await sendNotify(
  //         "Вы успешно отписались от уведомлений",
  //         chatId,
  //         bot.botName
  //       );
  //     }
  //   } catch (error) {
  //     TOAST.ERROR(
  //       "Не удалось отписаться от уведомлений. Попробуйте еще раз или позже."
  //     );
  //     console.error("Ошибка при отписке от бота:", error);
  //   } 
  // };

  const isActiveBot = bot ? bot.isActive : false;

const openTelegramLink = (botName: string, userId: string, chatName?: string) => {
  // Формируем команду /start
  const startCommand = `${userId}-${botName}-${chatName ?? "default"}`;

  // Кодируем в URL-safe Base64
  const encodedCommand = btoa(startCommand)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // Формируем ссылку
  const url = `https://t.me/${botName}?start=${encodedCommand}`;

  // Открываем Telegram
  window.open(url, "_blank");
};

 const handleChange = async () => {
  if (!authUser || !bot) return;
  try {
    setIsFetch(true);
    console.log(bot,'bot');
    // Если у бота ещё нет записи в БД
    if (!bot.id && bot.botName) {
      openTelegramLink(bot.botName, authUser.id);
      return;
    }

    if (!isActiveBot) {
      updateStatusChatBot({
        botId: bot.id || "",
        chatId: String(bot.chatId),
        isActive: true,
      });
      await sendNotify(
        `Вы успешно подписались на уведомления - ${bot.description}`,
        bot.chatId,
        bot.botName
      );
    }
  } catch (error) {
    console.error("Ошибка при изменении статуса бота:", error);
    TOAST.ERROR("Не удалось изменить статус бота.");
  } finally {
    setIsFetch(false);
    refetch();
  }
};


  return { isFetchingRequest, isActiveBot, handleChange };
};

export default useChatBot;
