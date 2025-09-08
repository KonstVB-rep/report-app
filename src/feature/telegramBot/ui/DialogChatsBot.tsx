import { useState } from "react";

import { MessageSquareMore } from "lucide-react";

import { BotData } from "@/entities/tgBot/types";
import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";

import { useGetChatsByBotId } from "../hooks/query";
import ChatList from "./ChatList";

const DialogChatsBot = ({ bot }: { bot: BotData }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const { data: chats, isFetching } = useGetChatsByBotId(bot.id);
  if (!bot.id) return null;

  return (
    <DialogComponent
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Button
          variant="outline"
          title="Открыть чаты бота"
          size="icon"
          className="flex items-center gap-2 justify-center shrink-0"
        >
          <MessageSquareMore />
        </Button>
      }
      classNameContent="sm:max-w-[400px] w-full"
    >
      <ChatList bot={bot} chats={chats} isFetching={isFetching} />
    </DialogComponent>
  );
};

export default DialogChatsBot;
