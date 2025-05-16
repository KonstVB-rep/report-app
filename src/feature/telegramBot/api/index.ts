'use server'

import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";;

export const createTelegramBot = async (botName: string, token: string) => {
  try {
    // await handleAuthorization();

    const bot = await prisma.telegramBot.findUnique({
      where: { botName , token},
      include: { chats: true },
    });

    if (bot) {
      return bot;
    }

    const newBot = await prisma.telegramBot.create({
      data: { botName, token},
    });
    return newBot;
  } catch (error) {
    console.error(error);
    handleError(
      typeof error === "string" ? error : "Ошибка записи Telegram данных"
    );
  }
};

export const getTelegramBotInDb = async (botName: string, userId: string, chatName: string) => {

    try {

    const bot = await prisma.telegramBot.findUnique({
      where: { botName },
    });

    if (!bot) {
      return null;
    }

    // Ищем чат с этим chatId
    const chat = await prisma.userTelegramChat.findUnique({
      where: { botId:bot.id, userId, chatName },
    });

    if (!chat) {
      return null;
    }

    return { ...bot, isActive: chat.isActive, chatId: chat.chatId ,chatName: chat.chatName};
  } catch (error) {
    console.error(error);
    handleError(
      typeof error === "string" ? error : "Ошибка получения Telegram данных"
    );
  }
  };

export const createUserTelegramChat = async (
  userId:string,
  chatId: number,
  telegramUserId: number,
  telegramUsername:string,
  chatName: string,
  botName: string,
  token: string
) => {

  try {
    // const data = await handleAuthorization();
    // const { userId } = data!;

    const bot = await prisma.telegramBot.findUnique({
      where: { botName, token },
    });

    if (!bot) {
      throw new Error("Бот не найден в системе");
    }

    const existingChat = await prisma.userTelegramChat.findUnique({
      where: {
        botId_telegramUserId: {
            botId: bot.id,
            telegramUserId: String(telegramUserId),
          },
      },
    });

    if (!existingChat) {
      await prisma.userTelegramChat.create({
        data: {
          userId,
          botId: bot.id,
          chatId: String(chatId),
          telegramUserId:  String(telegramUserId),
          telegramUsername,
          chatName,
          isActive: true,
        },
      });
    }else{
      await prisma.userTelegramChat.update({
        where: {
          userId,
          botId: bot.id,
          chatId: String(chatId),
          telegramUserId:  String(telegramUserId),
          telegramUsername,
          chatName,
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


export const toggleSubscribeChatBot = async (chatName: string, isActive: boolean) => {
  if (!chatName) {
    throw new Error("chatName не может быть пустым");
  }

  try {
    const existingChat = await prisma.userTelegramChat.findUnique({ where: { chatName } });

    if (!existingChat) {
      throw new Error(`Чат - ${chatName} не найден в базе`);
    }

    const updatedChat = await prisma.userTelegramChat.update({
      where: { chatName },
      data: { isActive },
    });
    
    return updatedChat;
  } catch (error) {
    console.error("Ошибка отписки:", error);
    throw error;
  }
}
