"use client";

import { useEffect, useState, useRef, useCallback } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import { sendNotification } from "../api";
import { useUpdateChatBot } from "../hooks/mutate";
import { useGetInfoChat } from "../hooks/query";

const CalendarBotLink = ({chatName}: {chatName: string }) => {
  const { authUser } = useStoreUser();

  const { data: bot, isPending, refetch } = useGetInfoChat(chatName);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { mutate: updateStatusChatBot } = useUpdateChatBot();

  const [isChecked, setIsChecked] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleUnsubscribeChatBot = async (chatName: string, chatId: string) => {
    if (!bot?.botName) return;

    try {
      setIsFetching(true);

      setIsChecked(false);
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

  const pollForChatName = useCallback(async () => {
  
      if(bot?.chatName && !isActiveBot){
        updateStatusChatBot({ chatName: bot?.chatName, isActive: true });
        return;
      }
    
      await refetch(); 
      timeoutRef.current = setTimeout(pollForChatName, 1000);
  }, [bot?.chatName, isActiveBot, refetch, updateStatusChatBot]);
  

  const handleChange = async () => {

    if (!authUser || !bot) return;
    setIsFetching(true)
    try {
      if (!isActiveBot && bot.botName) {
        openTelegramLink(bot.botName, authUser.id);

        pollForChatName()
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
    if(bot?.chatName && !isActiveBot){
      if(timeoutRef.current) clearTimeout(timeoutRef.current)
    }
   return () => {
    if(timeoutRef.current) clearTimeout(timeoutRef.current)
   }
  }, [bot, isActiveBot])


  useEffect(() => {

    if (isActiveBot) {
      setIsChecked(isActiveBot);
      setIsFetching(false)
      TOAST.SUCCESS("Вы успешно подписались на уведомления.");
    } else {
      setIsChecked(isActiveBot);
    }
  }, [isActiveBot]);

  if (isPending) return null;


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
