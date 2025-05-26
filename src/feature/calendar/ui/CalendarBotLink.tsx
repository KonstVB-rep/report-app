"use client";

import { useEffect, useState } from "react";

import { Loader } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { cn } from "@/shared/lib/utils";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import { TOAST } from "@/shared/ui/Toast";
import TooltipComponent from "@/shared/ui/TooltipComponent";

import { sendNotification } from "../api";
import { useUpdateChatBot } from "../hooks/mutate";
import { useGetInfoChat } from "../hooks/query";
import TelegramIcon from "./TelegramIcon";

const CalendarBotLink = ({ chatName }: { chatName: string }) => {
  const { authUser } = useStoreUser();

  const [isRefech, setIsRefech] = useState(false);

  const [isFetch, setIsFetch] = useState(false);

  const { data: bot, isFetching } = useGetInfoChat(chatName, isRefech, 1);

  const isFetchingRequest = isFetching || isFetch;

  const { mutate: updateStatusChatBot } = useUpdateChatBot();

  const handleUnsubscribeChatBot = async (chatName: string, chatId: string) => {
    if (!bot?.botName) return;

    try {
      setIsFetch(true);
      updateStatusChatBot({
        botId: bot.id,
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
        updateStatusChatBot({ botId: bot.id, isActive: true });
        await sendNotification(
          "Вы успешно подписались на уведомления календаря",
          bot.chatId,
          bot.botName
        );
      } else {
        if (bot.chatName && bot.chatId) {
          await handleUnsubscribeChatBot(bot.chatName, bot.chatId);
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

  if (!chatName) return null;

  return (
    <MotionDivY className="flex flex-col items-center">
      <TooltipComponent
        content={`Уведомления в Telegram ${isActiveBot ? "включены" : "выключены"}`}
      >
        <Toggle
          aria-label="Вкл/Выкл уведомления в телеграмм"
          pressed={isActiveBot}
          onPressedChange={handleChange}
          className={cn(
            isActiveBot
              ? "shadow-[0_0_0px_2px_#1C93E3]"
              : "shadow-[0_0_0px_2px_#444444]",
            isFetchingRequest && "cursor-not-allowed pointer-events-none"
          )}
          disabled={isFetchingRequest}
        >
          {isFetchingRequest ? (
            <Loader className="animate animate-spin" />
          ) : (
            <TelegramIcon fill={isActiveBot ? "#1C93E3" : "#777777"} />
          )}
        </Toggle>
      </TooltipComponent>
    </MotionDivY>
  );
};

export default CalendarBotLink;
