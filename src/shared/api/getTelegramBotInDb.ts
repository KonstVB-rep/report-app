import prisma from "@/prisma/prisma-client";
import { handleError } from "./handleError";

export const getTelegramBotInDb = async (botName: string, userId: string) => {
  try {
    const bot = await prisma.telegramBot.findUnique({
      where: { botName },
    });


    if (!bot) {
      return null;
    }

    const chat = await prisma.userTelegramChat.findUnique({
      where: {
        botId_userId: {
          botId: bot.id,
          userId,
        },
      },
    });

    if (!chat) {
      return null;
    }

    return {
      ...bot,
      isActive: chat.isActive,
      chatId: chat.chatId,
      chatName: chat.chatName,
    };
  } catch (error) {
    console.error(error);
    throw handleError(
      typeof error === "string" ? error : "Ошибка получения Telegram данных"
    );
  }
};