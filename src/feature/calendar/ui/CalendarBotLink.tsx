"use client";

import { Loader } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/shared/lib/utils";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import TooltipComponent from "@/shared/ui/TooltipComponent";

import useChatBot from "../hooks/useChatBot";
import TelegramIcon from "./TelegramIcon";

const CalendarBotLink = ({ chatName }: { chatName: string }) => {
  const { isFetchingRequest, isActiveBot, handleChange } = useChatBot(chatName);

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
