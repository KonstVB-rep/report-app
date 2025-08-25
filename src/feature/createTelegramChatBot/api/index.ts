import { TelegramBot } from "@prisma/client";

import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";

import { ChatBotType } from "../type";

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

export const deleteTelegramBot = async (botName: string, token: string) => {
  try {
    await handleAuthorization();

    const bot = await prisma.telegramBot.findUnique({
      where: { botName, token },
      include: { chats: true },
    });

    if (!bot) {
      throw new Error("Телеграм бот не найден");
    }

    const deletedBot = await prisma.telegramBot.delete({
      where: { id: bot.id },
    });

    await prisma.userTelegramChat.deleteMany({
      where: { botId: bot.id },
    });

    return deletedBot;
  } catch (error) {
    console.error(error);
    throw handleError(
      typeof error === "string" ? error : "Ошибка записи Telegram данных"
    );
  }
};

export const getAllBots = async (): Promise<TelegramBot[]> => {
  try {
    await handleAuthorization();

    const bots = await prisma.telegramBot.findMany();

    if (!bots) {
      throw new Error("Телеграм боты не найден");
    }

    await prisma.userTelegramChat.findMany({});

    return bots;
  } catch (error) {
    console.error(error);
    throw handleError(
      typeof error === "string" ? error : "Ошибка записи Telegram данных"
    );
  }
};

export const getAllChatsBot = async () => {
  try {
    await handleAuthorization();

    const chats = await prisma.userTelegramChat.findMany();

    if (!chats) {
      throw new Error("Телеграм боты не найден");
    }

    return chats;
  } catch (error) {
    console.error(error);
    throw handleError(
      typeof error === "string" ? error : "Ошибка записи Telegram данных"
    );
  }
};

export const createUserTelegramChat = async (
  userId: string,
  botName: string,
  chatId: string,
  telegramUserInfoId: string,
  chatName: string,
  username: string
) => {
  try {
    const bot = await prisma.telegramBot.findUnique({
      where: { botName },
    });

    if (!bot) {
      throw new Error("Бот не найден в системе");
    }

    const telegramUserInfo = await prisma.telegramUserInfo.findUnique({
      where: { tgUserId:  telegramUserInfoId},
    });

    if (!telegramUserInfo) {
      await prisma.telegramUserInfo.create({
        data: {
          tgUserId: telegramUserInfoId,
          tgUserName: username,
          botId: bot.id,
          userId: userId,
        },
      })
    }


    const existingChat = await prisma.userTelegramChat.findUnique({
      where: {
        botId_chatId: {
          botId: bot.id,
          chatId: String(chatId),
        },
      },
    });

    if (!existingChat) {
      await prisma.userTelegramChat.create({
        data: {
          userId,
          botId: bot.id,
          chatId: String(chatId),
          telegramUserInfoId: String(telegramUserInfoId),
          chatName,
          isActive: true,
        },
      });
    } else {
      throw new Error("Чат уже существует");
    }
  } catch (error) {
    console.error(error);
    handleError(
      typeof error === "string" ? error : "Ошибка создания Telegram чата"
    );
  }
};

export const toggleSubscribeChatBot = async (chatBotData: ChatBotType) => {
  const { chatName, chatId, isActive } = chatBotData;
  if (!chatName) {
    throw new Error("chatName не может быть пустым");
  }

  try {
    const existingChat = await prisma.userTelegramChat.findUnique({
      where: {
        botId_chatId: {
          // Изменилось с botId_userId на botId_chatId
          botId: chatName, // Убедитесь, что chatName действительно является botId
          chatId, // И userId действительно является chatId
        },
      },
    });

    if (!existingChat) {
      throw new Error(`Чат не найден в базе`);
    }

    const updatedChat = await prisma.userTelegramChat.update({
      where: {
        botId_chatId: {
          botId: chatName,
          chatId,
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
