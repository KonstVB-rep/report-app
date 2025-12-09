"use client"

import { memo } from "react"
import { EllipsisVertical } from "lucide-react"
import type { BotWithChats } from "@/entities/tgBot/types"
import DialogChatsBot from "@/feature/telegramBot/ui/DialogChatsBot"
import DialogCreateChatForm from "@/feature/telegramBot/ui/DialogCreateChatForm"
import DialogDeleteBot from "@/feature/telegramBot/ui/DialogDeleteBot"
import DialogEditBot from "@/feature/telegramBot/ui/DialogEditBot"
import { Button } from "@/shared/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"

const BotActionsMenu = memo(({ bot }: { bot: BotWithChats }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 w-8" size="icon" variant="ghost">
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Меню действий</span>
        </Button>
      </PopoverTrigger>
      {/* PopoverContent ленивый, диалоги не маунтятся пока не открыт поповер */}
      <PopoverContent align="end" className="w-fit p-2">
        <div className="grid gap-2">
          <DialogEditBot bot={bot} />
          <DialogDeleteBot bot={bot} />
          {bot.chats.length > 0 ? <DialogChatsBot bot={bot} /> : <DialogCreateChatForm bot={bot} />}
        </div>
      </PopoverContent>
    </Popover>
  )
})

BotActionsMenu.displayName = "BotActionsMenu"
export default BotActionsMenu
