"use client"

import { Bot, Plus } from "lucide-react"
import type { BotWithChats } from "@/entities/tgBot/types"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import { CreateBotForm } from "./CreateBotForm"
import DialogChatsBot from "./DialogChatsBot"
import DialogCreateChatForm from "./DialogCreateChatForm"
import DialogDeleteBot from "./DialogDeleteBot"
import DialogEditBot from "./DialogEditBot"

const BotsList = ({ bots }: { bots: BotWithChats[] }) => {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-md border self-start bg-stone-900 w-fit max-h-[86vh] overflow-auto">
      <DialogComponent
        classNameContent="w-fit"
        contentTooltip="Добавить бота"
        trigger={
          <Button className="self-end flex gap-2" title="Добавить бот" variant="outline">
            <span className="text-sm text-muted-foreground">Добавить бота</span>
            <Plus />
          </Button>
        }
      >
        <CreateBotForm />
      </DialogComponent>
      {
        <ul className="flex flex-col gap-2">
          <li className="text-center text-lg font-medium">Список ботов:</li>
          {bots.map((bot) => {
            const data = {
              id: bot.id,
              botName: bot.botName,
              description: bot.description || "",
              token: bot.token,
            }
            return (
              <li
                className="flex justify-between items-center gap-3 w-full p-2 border rounded-md bg-background italic"
                key={bot.id}
              >
                <p className="flex flex-col gap-2 w-full">
                  <span className="flex gap-2 items-center text-semibold">
                    <Bot size={24} />
                    {bot.description}
                  </span>
                </p>
                <div className="flex gap-2 items-center">
                  <DialogEditBot bot={data} />

                  <DialogDeleteBot bot={data} />

                  {bot.chats.length > 0 ? (
                    <DialogChatsBot bot={data} />
                  ) : (
                    <DialogCreateChatForm bot={data} />
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      }
    </div>
  )
}

export default BotsList
