"use client";

import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import { sendNotification } from "../api";
import { useUpdateChatBot } from "../hooks/mutate";
import { useGetInfoChat } from "../hooks/query";

const CalendarBotLink = () => {
  const { authUser } = useStoreUser();

  const { data: bot, isPending } = useGetInfoChat("calendarChat");

  const { mutate: updateStatusChatBot } = useUpdateChatBot();

  const [isChecked, setIsChecked] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleUnsubscribeChatBot = async (chatName: string, chatId: string) => {
    if (!bot?.botName) return;

    try {
      setIsFetching(true);
      // Делаем мутацию с ожиданием завершения
      setIsChecked(false);
      updateStatusChatBot({
        chatName,
        isActive: false,
      });

      if (chatId) {
        // Делаем отправку уведомления
        await sendNotification(
          "Вы успешно отписались от уведомлений",
          chatId,
          bot.botName
        );
      }

      TOAST.SUCCESS("Вы успешно отписались от уведомлений.");
    } catch (error) {
      // Показываем ошибку
      TOAST.ERROR(
        "Не удалось отписаться от уведомлений. Попробуйте еще раз или позже."
      );
      console.error("Ошибка при отписке от бота:", error);
      setIsChecked(true);
    } finally {
      setIsFetching(false);
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
      if (!isActiveBot && bot.chatName) {
        openTelegramLink(bot.botName, authUser.id);
        updateStatusChatBot({ chatName: bot.chatName, isActive: true });
      } else {
        if (bot.chatName && bot.chatId) {
          await handleUnsubscribeChatBot(bot.chatName, bot.chatId);
        }
      }
    } catch (error) {
      console.error("Ошибка при изменении статуса бота:", error);
      TOAST.ERROR("Не удалось изменить статус бота.");
    }
  };

  useEffect(() => {
    if (isActiveBot) {
      setIsChecked(isActiveBot);
    } else {
      setIsChecked(isActiveBot);
    }
  }, [bot, isActiveBot]);

  if (isPending) return null;

  if (!bot || !bot.botName || !authUser) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center space-x-2">
        {isFetching ? (
          <Switch
            id="calendar-bot"
            checked={isChecked}
            disabled={isFetching}
            className="switch-telegram-notify-fetching disabled:opacity-50 cursor-not-allowed"
          />
        ) : (
          <Switch
            id="calendar-bot"
            checked={isChecked}
            onCheckedChange={handleChange}
            title="Уведомления в Telegram"
            className="switch-telegram-notify"
          />
        )}
        <Label htmlFor="calendar-bot" className="flex gap-1">
          <span className="text-xs text-stone-600">
            {isChecked ? "Включены" : "Выключены"}
          </span>
        </Label>
      </div>
    </>
  );
};

export default CalendarBotLink;
