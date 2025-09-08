import { UserTelegramChat } from "@prisma/client";

export type BotData = {
  id: string;
  botName: string;
  token: string;
  description: string;
};

export type BotFormData = Omit<BotData, "id">;

export type ChatFormData = {
  userId: string;
  botName: string;
  chatId: string;
  telegramUserInfoId: string;
  chatName: string;
  username?: string;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
};

export type BotWithChats = {
  id: string;
  botName: string;
  description: string;
  token: string;
  chats: Omit<UserTelegramChat, "createdAt" | "updatedAt">[];
};
