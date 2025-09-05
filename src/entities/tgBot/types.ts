import { UserTelegramChat } from "@prisma/client";

export type BotData = {
  id: string;
  botName: string;
  token: string;
  description: string;
}

export type BotFormData = Omit<BotData, "id">

export type ChatFormData = {
  userId: string; // ID пользователя в вашей системе
  botName: string;
  chatId: string; // ID чата в Telegram
  telegramUserInfoId: string; // ID информации о Telegram пользователе
  chatName: string;
  username?: string;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
}

export type BotWithChats = {
  id: string,
  botName: string,
  description: string,
  token: string,
  chats: Omit<UserTelegramChat, "createdAt" | "updatedAt">[]
}
