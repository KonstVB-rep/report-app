"use client";

import { TelegramBot } from "@prisma/client";

import React from "react";

import { Bot, Plus, Trash } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";

import { CreateBotForm } from "./CreateBotForm";

const BotsList = ({ bots }: { bots: TelegramBot[] }) => {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-md border self-start bg-stone-900 max-h-[86vh] overflow-auto">
      <DialogComponent
        contentTooltip="Добавить бота"
        trigger={
          <Button
            variant="outline"
            title="Добавить бот"
            className="self-end flex gap-2"
          >
            <span className="text-sm text-muted-foreground">Добавить бота</span>
            <Plus />
          </Button>
        }
      >
        <CreateBotForm />
      </DialogComponent>
      <ul className="flex flex-col gap-2">
        <li className="text-center text-lg font-medium">Список ботов:</li>
        {bots.map((bot) => (
          <li
            key={bot.id}
            className="flex justify-between items-center gap-3 w-full p-2 border rounded-md bg-background italic"
          > <Bot size={40}/>
            <p className="flex flex-col gap-2 w-full">
              <span className="block py-1 px-3 bg-muted rounded-md w-full">
                Бот: {bot.botName}
              </span>
              <span className="text-sm text-muted-foreground">
                {bot.description}
              </span>
            </p>
            <Button variant="destructive" size="icon" title="Удалить бота">
              <Trash />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BotsList;
