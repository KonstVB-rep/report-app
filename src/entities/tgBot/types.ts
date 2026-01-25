import type { UserTelegramChat } from "@prisma/client"
import type { SharedTableRowProps } from "@/shared/custom-components/ui/Table/model/types"
import type { TaskWithUserInfo } from "../task/types"

export type BotData = {
  id: string
  botName: string
  token: string
  description: string
}

export type BotFormData = Omit<BotData, "id">

export type ChatFormData = {
  userId: string
  botName: string
  chatId: string
  telegramUserInfoId: string
  chatName: string
  username?: string
  isActive?: boolean
  firstName?: string
  lastName?: string
}

export type BotWithChats = {
  id: string
  botName: string
  description: string
  token: string
  chats: Omit<UserTelegramChat, "createdAt" | "updatedAt">[]
}

export type TaskTableRowProps<T extends TaskWithUserInfo> = SharedTableRowProps<T>
