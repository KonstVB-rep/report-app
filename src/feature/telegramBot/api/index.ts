"use server";

import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";

export const createTelegramBot = async (botName: string, token: string) => {
  try {
    // await handleAuthorization();

    const bot = await prisma.telegramBot.findUnique({
      where: { botName, token },
      include: { chats: true },
    });

    if (bot) {
      return bot;
    }

    const newBot = await prisma.telegramBot.create({
      data: { botName, token },
    });
    return newBot;
  } catch (error) {
    console.error(error);
    throw handleError(
      typeof error === "string" ? error : "Ошибка записи Telegram данных"
    );
  }
};

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

export const createUserTelegramChat = async (
  userId: string,
  chatId: number,
  telegramUserId: number,
  telegramUsername: string,
  chatName: string,
  botName: string,
  token: string
) => {
  try {

    const bot = await prisma.telegramBot.findUnique({
      where: { botName, token },
    });

    if (!bot) {
      throw new Error("Бот не найден в системе");
    }

    const existingChat = await prisma.userTelegramChat.findUnique({
      where: {
        botId_userId: {
          botId: bot.id,
          userId,
        },
      },
    });

    if (!existingChat) {
      await prisma.userTelegramChat.create({
        data: {
          userId,
          botId: bot.id,
          chatId: String(chatId),
          telegramUserId: String(telegramUserId),
          telegramUsername,
          chatName,
          isActive: true,
        },
      });
    } else {
      await prisma.userTelegramChat.update({
        where: {
          botId_userId: {
            botId: bot.id,
            userId,
          },
        },
        data: { isActive: true },
      });
    }
  } catch (error) {
    console.error(error);
    handleError(
      typeof error === "string" ? error : "Ошибка создания Telegram данных"
    );
  }
};

export const toggleSubscribeChatBot = async (
  botId: string,
  userId: string,
  isActive: boolean
) => {
  if (!botId) {
    throw new Error("chatName не может быть пустым");
  }

  try {
    const existingChat = await prisma.userTelegramChat.findUnique({
      where: {
        botId_userId: {
          botId,
          userId,
        },
      },
    });

    if (!existingChat) {
      throw new Error(`Чат не найден в базе`);
    }

    const updatedChat = await prisma.userTelegramChat.update({
      where: {
        botId_userId: {
          botId,
          userId,
        },
      },
      data: { isActive },
    });

    return updatedChat;
  } catch (error) {
    console.error("Ошибка отписки:", error);
    throw error;
  }
};
