"use client";

import { Loader } from "lucide-react";

import { Toggle } from "@/shared/components/ui/toggle";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent";
import { cn } from "@/shared/lib/utils";

import useChatBot from "../../telegramBot/hooks/useChatBot";
import TelegramIcon from "./TelegramIcon";

const CalendarBotLink = ({ botName }: { botName: string }) => {
  const { isFetchingRequest, isActiveBot, handleChange } = useChatBot(botName);

  if (!botName || isActiveBot) return null;

  return (
    <MotionDivY className="flex flex-col items-center">
      <TooltipComponent
        content={`Уведомления в Telegram ${isActiveBot ? "включены" : "выключены"}`}
      >
        <Toggle
          aria-label="Вкл уведомления в телеграмм"
          pressed={isActiveBot}
          onPressedChange={handleChange}
          className={cn(
            "shadow-[0_0_0px_2px_#444444]",
            isFetchingRequest && "cursor-not-allowed pointer-events-none"
          )}
          disabled={isFetchingRequest}
        >
          {isFetchingRequest ? (
            <Loader className="animate-spin" />
          ) : (
            <TelegramIcon fill={isActiveBot ? "#1C93E3" : "#777777"} />
          )}
        </Toggle>
      </TooltipComponent>
    </MotionDivY>
  );
};

export default CalendarBotLink;
