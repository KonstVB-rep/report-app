"use server"

import { prisma } from "@/prisma/prisma-client"
import { handleError } from "./handleError"

export const getTelegramChatBotInDb = async (botName: string, userId: string) => {
  try {
    const bot = await prisma.telegramBot.findUnique({
      where: { botName },
    })

    if (!bot) {
      return null
    }

    const getUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        telegramInfo: {
          select: {
            tgUserId: true,
          },
        },
      },
    })

    if (!getUser || !getUser.telegramInfo[0]?.tgUserId) {
      return {
        ...bot,
        isActive: false,
        chatId: null,
        chatName: null,
      }
    }

    const chat = await prisma.userTelegramChat.findUnique({
      where: {
        botId_chatId: {
          botId: bot.id,
          chatId: getUser.telegramInfo[0]?.tgUserId,
        },
      },
    })

    if (!chat) {
      return {
        ...bot,
        isActive: false,
        chatId: null,
        chatName: null,
      }
    }

    return {
      ...bot,
      isActive: chat.isActive,
      chatId: chat.chatId,
      chatName: chat.chatName,
    }
  } catch (error) {
    console.error(error)
    throw handleError(typeof error === "string" ? error : "Ошибка получения Telegram данных")
  }
}
