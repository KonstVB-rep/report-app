import { useEffect, useState } from "react";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { checkAuthorization } from "@/shared/lib/helpers/checkAuthorization";

import { sendNotification } from "../api";
import { useUpdateChatBot } from "./mutate";
import { useGetInfoChat } from "./query";

const useChatBot = (chatName: string) => {
  const { authUser } = useStoreUser();
  const [isRefech, setIsRefech] = useState(false);

  const [isFetch, setIsFetch] = useState(false);

  const { data: bot, isFetching } = useGetInfoChat(chatName, isRefech, 1);

  const isFetchingRequest = isFetching || isFetch;

  const { mutate: updateStatusChatBot } = useUpdateChatBot();

  const handleUnsubscribeChatBot = async (chatId: string) => {
    if (!bot?.botName) return;

    try {
      await checkAuthorization(authUser?.id);
      setIsFetch(true);
      updateStatusChatBot({
        botId: bot.id,
        chatId: String(chatId),
        isActive: false,
      });
      if (chatId) {
        await sendNotification(
          "Вы успешно отписались от уведомлений",
          chatId,
          bot.botName
        );
      }
    } catch (error) {
      TOAST.ERROR(
        "Не удалось отписаться от уведомлений. Попробуйте еще раз или позже."
      );
      console.error("Ошибка при отписке от бота:", error);
    } finally {
      setIsFetch(false);
    }
  };

  const isActiveBot = bot ? bot.isActive : false;

  const openTelegramLink = (botName: string, userId: string) => {
    const url = `https://t.me/${botName}?start=${userId}-${botName}-calendarChat`;
    window.open(url, "_blank");
  };

  const handleChange = async () => {
    if (!authUser || !bot) return;
    try {
      setIsFetch(true);
      if (!bot.id && bot.botName) {
        openTelegramLink(bot.botName, authUser.id);
        setIsRefech(true);
        return;
      }
      if (!isActiveBot) {
        updateStatusChatBot({ botId: bot.id, chatId: String(bot.chatId), isActive: true });
        await sendNotification(
          "Вы успешно подписались на уведомления календаря",
          bot.chatId,
          bot.botName
        );
      } else {
        if (bot.chatId) {
          await handleUnsubscribeChatBot(bot.chatId);
        }
      }
    } catch (error) {
      console.error("Ошибка при изменении статуса бота:", error);
      TOAST.ERROR("Не удалось изменить статус бота.");
    } finally {
      setIsFetch(false);
    }
  };

  useEffect(() => {
    if (bot?.chatName && isActiveBot) {
      setIsRefech(false);
    }
  }, [bot, isActiveBot]);
  return { isFetchingRequest, isActiveBot, handleChange };
};

export default useChatBot;
