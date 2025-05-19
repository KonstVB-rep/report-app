"use client";

import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import { sendNotification } from "../api";
import { useUpdateChatBot } from "../hooks/mutate";
import { useGetInfoChat } from "../hooks/query";

const CalendarBotLink = ({ chatName }: { chatName: string }) => {
  const { authUser } = useStoreUser();

  const [isRefech, setIsRefech] = useState(false)

  const [isFetch, setIsFetch] = useState(false)

  const {
    data: bot,
    isPending,
    isFetching
  } = useGetInfoChat(chatName, isRefech, 1);

  const { mutate: updateStatusChatBot } = useUpdateChatBot();

  const handleUnsubscribeChatBot = async (chatName: string, chatId: string) => {
    if (!bot?.botName) return;

    try {
      setIsFetch(true)
      updateStatusChatBot({
        chatName,
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
    }finally{
      setIsFetch(false)
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
      setIsFetch(true)
      if (!bot.id && bot.botName) {
        openTelegramLink(bot.botName, authUser.id);
        setIsRefech(true)
        return
      }
      if (!isActiveBot) {
        updateStatusChatBot({ chatName: bot?.chatName, isActive: true });
        await sendNotification( "Вы успешно подписались на уведомления календаря",
          bot.chatId,
          bot.botName)
      } else {
        if (bot.chatName && bot.chatId) {
          await handleUnsubscribeChatBot(bot.chatName, bot.chatId);
        }
      }
    } catch (error) {
      console.error("Ошибка при изменении статуса бота:", error);
      TOAST.ERROR("Не удалось изменить статус бота.");
    } finally{
      setIsFetch(false)
    }
  };

  useEffect(() => {
    if (bot?.chatName && isActiveBot) {
       setIsRefech(false);
    }
  }, [bot, isActiveBot, isFetching, isPending]);

  if (isPending) return null;

  return (
    <>
      <div className="flex flex-col items-center space-x-2">
        {isFetching || isFetch ? (
          <Switch
            id="calendar-bot"
            checked={isActiveBot}
            disabled={isFetching || isFetch}
            className="switch-telegram-notify-fetching disabled:opacity-50 cursor-not-allowed"
          />
        ) : (
          <Switch
            id="calendar-bot"
            checked={isActiveBot}
            onCheckedChange={handleChange}
            title="Уведомления в Telegram"
            className="switch-telegram-notify"
          />
        )}
        <Label htmlFor="calendar-bot" className="flex gap-1">
          <span className="text-xs text-stone-600">
            {isActiveBot ? "Включены" : "Выключены"}
          </span>
        </Label>
      </div>
    </>
  );
};

export default CalendarBotLink;
