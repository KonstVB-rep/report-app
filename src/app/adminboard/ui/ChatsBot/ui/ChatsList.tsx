"use client";

import { TelegramBot, UserTelegramChat } from "@prisma/client";

import React from "react";

import { BotMessageSquareIcon, Plus } from "lucide-react";

import { getManagers } from "@/entities/department/lib/utils";
import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";

import { CreateUserChatForm } from "./CreateUserChatForm";
import DeleteChat from "@/feature/telegramChatBot/ui/DeleteChat";

const managers = getManagers(false);

const ChatsList = ({
  chats,
  bots,
}: {
  chats: UserTelegramChat[];
  bots: TelegramBot[];
}) => {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-md border self-start bg-stone-900 max-h-[86vh] overflow-auto">
      <DialogComponent
        contentTooltip="Добавить чат"
        trigger={
          <Button
            variant="outline"
            title="Добавить чат"
            className="self-end flex gap-2"
          >
            <span className="text-sm text-muted-foreground">Добавить чат</span>
            <Plus />
          </Button>
        }
      >
        <CreateUserChatForm bots={bots} />
      </DialogComponent>
      {chats.length > 0 && (
        <ul className="flex flex-col gap-2">
          <li className="text-center text-lg font-medium">Список чатов:</li>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="flex justify-between items-center gap-3 w-full p-2 border rounded-md italic"
            >
              <BotMessageSquareIcon size={40} />
              <p className="flex flex-col gap-2 flex-1">
                <span className="block py-1 px-3 bg-muted rounded-md w-full">
                  Чат: {chat.chatName}
                </span>
                <span className="text-sm text-muted-foreground">
                  <span className="capitalize">{managers[chat.userId]}</span> /{" "}
                  {chat.isActive ? "Активен" : "Не активен"}
                </span>
              </p>
             <DeleteChat chat={chat} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatsList;
