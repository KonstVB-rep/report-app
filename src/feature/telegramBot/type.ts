// export type ChatType = { chatName: string; chatId: string; isActive: boolean };

export type ChatBotType = {
  chatName: string;
  chatId: string;
  isActive: boolean;
};

export type ResponseChatBotType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isActive: boolean;
  botId: string;
  chatId: string;
  chatName: string | null;
  telegramUserInfoId: string;
};
