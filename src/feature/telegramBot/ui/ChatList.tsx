"use client"

import type { UserTelegramChat } from "@prisma/client"
import { BotMessageSquareIcon } from "lucide-react"
import { getUsers } from "@/entities/department/lib/utils"
import type { BotData } from "@/entities/tgBot/types"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import DeleteChat from "./DeleteChat"
import DialogCreateChatForm from "./DialogCreateChatForm"
import DialogEditChatForm from "./DialogEditChatForm"

const managers = getUsers(false)

const ChatList = ({
  bot,
  chats,
  isFetching,
}: {
  bot: BotData
  chats: UserTelegramChat[]
  isFetching: boolean
}) => {
  if (chats.length === 0 && !isFetching) {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2 p-3 pt-5 rounded-md self-start border-none max-h-[86vh] text-lg font-semibold">
        Нет чатов
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full p-1 pt-5 rounded-md self-start border-none max-h-[86vh] overflow-auto">
      <p className="flex flex-col items-center gap-2 justify-center text-lg font-medium">
        <BotMessageSquareIcon size={40} />
        Список чатов: {bot.description}
      </p>

      {isFetching && chats.length === 0 && <LoaderCircle className="self-center" />}

      <div className="absolute top-2 left-2">
        <DialogCreateChatForm bot={bot} />
      </div>

      {chats.length > 0 && (
        <ul className="flex flex-col gap-2">
          {chats.map((chat) => (
            <li
              className="flex justify-between items-center gap-3 w-full p-2 border rounded-md italic"
              key={chat.id}
            >
              <p className="flex flex-col gap-2 flex-1">
                <span className="block py-1 px-3 bg-muted rounded-md w-full">
                  Чат: <span className="break-all">{chat.chatName}</span>
                </span>
                <span className="text-sm text-muted-foreground">
                  <span className="capitalize">{managers[chat.userId]}</span> /{" "}
                  {chat.isActive ? "Активен" : "Не активен"}
                </span>
              </p>
              <div className="flex gap-2">
                <DeleteChat data={{ chat, botName: bot.botName }} />
                <DialogEditChatForm chat={chat} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ChatList
