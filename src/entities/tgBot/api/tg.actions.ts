"use server"

import { Prisma } from "@prisma/client"
import { requireUser } from "@/app/api/utils/requireAuth"
import { prisma } from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import type { SuccessResponse } from "@/shared/types"

// --- Actions ---

export const createTelegramBot = async (botName: string, token: string, description: string) => {
  try {
    await requireUser()

    const existingBot = await prisma.telegramBot.findFirst({
      where: {
        OR: [{ botName }, { token }],
      },
      select: { id: true },
    })

    if (existingBot) {
      throw new Error("Бот с таким именем или токеном уже существует")
    }

    return await prisma.telegramBot.create({
      data: { botName, token, description },
      include: { chats: true },
    })
  } catch (error) {
    console.error("createTelegramBot error:", error)
    throw handleError(error instanceof Error ? error.message : "Ошибка создания Telegram бота")
  }
}

// const deleteTelegramBot = async (botName: string, token: string) => {
//   try {
//     await requireUser()

//     const result = await prisma.$transaction(async (tx) => {
//       const bot = await tx.telegramBot.findUnique({
//         where: { botName },
//       })

//       if (!bot) throw new Error("Телеграм бот не найден")
//       if (bot.token !== token) throw new Error("Неверный токен для данного бота")

//       await tx.userTelegramChat.deleteMany({
//         where: { botId: bot.id },
//       })

//       return await tx.telegramBot.delete({
//         where: { id: bot.id },
//       })
//     })

//     return result
//   } catch (error) {
//     console.error("deleteTelegramBot error:", error)
//     throw handleError(error instanceof Error ? error.message : "Ошибка удаления Telegram бота")
//   }
// }

// const getAllChats = async () => {
//   try {
//     await requireUser()
//     return await prisma.userTelegramChat.findMany({
//       select: {
//         chatName: true,
//         id: true,
//       },
//     })
//   } catch (error) {
//     console.error("getAllChats error:", error)

//     throw handleError("Произошла ошибка при получении чатов")
//   }
// }

// const getAllBots = async (): Promise<BotWithChats[]> => {
//   try {
//     await requireUser()

//     const bots = await prisma.telegramBot.findMany({
//       include: {
//         chats: {
//           select: {
//             id: true,
//             userId: true,
//             botId: true,
//             chatId: true,
//             chatName: true,
//             isActive: true,
//             telegramUserInfoId: true,
//           },
//         },
//       },
//     })

//     return bots
//   } catch (error) {
//     console.error("getAllBots error:", error)
//     throw handleError(error instanceof Error ? error.message : "Ошибка получения Telegram ботов")
//   }
// }

// const getChatsByBotId = async (botId: string) => {
//   try {
//     await requireUser()
//     return await prisma.userTelegramChat.findMany({
//       where: { botId },
//       include: {
//         telegramUserInfo: true,
//         user: true,
//         bot: true,
//       },
//     })
//   } catch (error) {
//     console.error("getChatsByBotId error:", error)
//     throw handleError(error instanceof Error ? error.message : "Ошибка при получении чатов")
//   }
// }

export const createUserTelegramChat = async (
  userId: string,
  botName: string,
  chatId: string,
  telegramUserInfoData: {
    tgUserId: string
    tgUserName?: string
    firstName?: string
    lastName?: string
    languageCode?: string
    isBot?: boolean
  },
  chatName: string,
  isActive = true,
): Promise<SuccessResponse> => {
  try {
    await requireUser()

    const bot = await prisma.telegramBot.findUnique({
      where: { botName },
      select: { id: true },
    })

    if (!bot) {
      return { success: false, message: "Бот не найден в системе" }
    }

    const telegramUserInfo = await prisma.telegramUserInfo.upsert({
      where: { tgUserId: telegramUserInfoData.tgUserId },
      update: {},
      create: {
        ...telegramUserInfoData,
        userId: userId,
      },
    })

    await prisma.userTelegramChat.create({
      data: {
        userId,
        botId: bot.id,
        chatId,
        telegramUserInfoId: telegramUserInfo.id,
        chatName,
        isActive,
      },
    })

    return { success: true, message: "Чат успешно создан" }
  } catch (error) {
    console.error("createUserTelegramChat error:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, message: "Чат уже существует" }
    }

    return { success: false, message: "Ошибка создания Telegram чата" }
  }
}

// const updateUserTelegramChat = async (data: {
//   botId: string
//   chatId: string
//   chatName: string
//   isActive: boolean
// }): Promise<{
//   success: boolean
//   message: string
//   result?: UserTelegramChat
// }> => {
//   try {
//     await requireUser()

//     const result = await prisma.userTelegramChat.update({
//       where: {
//         botId_chatId: {
//           botId: data.botId,
//           chatId: data.chatId,
//         },
//       },
//       data: {
//         chatName: data.chatName,
//         isActive: data.isActive,
//       },
//     })

//     return { success: true, message: "Чат успешно обновлен", result }
//   } catch (error) {
//     console.error("updateUserTelegramChat error:", error)
//     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
//       return { success: false, message: "Чат или бот не найден" }
//     }
//     return { success: false, message: "Ошибка обновления Telegram чата" }
//   }
// }

// const toggleSubscribeChatBot = async (data: {
//   botId: string
//   chatId: string
//   isActive: boolean
// }) => {
//   try {
//     await requireUser()

//     return await prisma.userTelegramChat.update({
//       where: {
//         botId_chatId: {
//           botId: data.botId,
//           chatId: data.chatId,
//         },
//       },
//       data: { isActive: data.isActive },
//     })
//   } catch (error) {
//     console.error("toggleSubscribeChatBot error:", error)
//     if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
//       throw new Error("Чат не найден")
//     }
//     throw error
//   }
// }

// const deleteChat = async (data: { botName: string; chatId: string }) => {
//   try {
//     await requireUser()

//     const bot = await prisma.telegramBot.findUnique({
//       where: { botName: data.botName },
//       select: { id: true },
//     })

//     if (!bot) throw new Error("Бот не найден")

//     return await prisma.userTelegramChat.delete({
//       where: {
//         botId_chatId: {
//           botId: bot.id,
//           chatId: data.chatId,
//         },
//       },
//     })
//   } catch (error) {
//     console.error("deleteChat error:", error)
//     throw error
//   }
// }

// const deleteBot = async (data: { botName: string; pathName: string }) => {
//   try {
//     await requireUser()

//     const result = await prisma.$transaction(async (tx) => {
//       const bot = await tx.telegramBot.findUnique({
//         where: { botName: data.botName },
//         select: { id: true },
//       })

//       if (!bot) throw new Error("Бот не найден")

//       await tx.userTelegramChat.deleteMany({
//         where: { botId: bot.id },
//       })

//       return await tx.telegramBot.delete({
//         where: { id: bot.id },
//       })
//     })

//     revalidatePath(data.pathName)
//     return result
//   } catch (error) {
//     console.error("deleteBot error:", error)
//     throw error
//   }
// }

// const updateBotDb = async (data: { botName: string; description: string; token: string }) => {
//   try {
//     await requireUser()

//     if (data.token) {
//       const tokenExists = await prisma.telegramBot.findFirst({
//         where: {
//           token: data.token,
//           NOT: { botName: data.botName },
//         },
//         select: { id: true },
//       })

//       if (tokenExists) {
//         throw new Error("Токен уже используется другим ботом")
//       }
//     }

//     return await prisma.telegramBot.update({
//       where: { botName: data.botName },
//       data: {
//         description: data.description,
//         token: data.token,
//       },
//     })
//   } catch (error) {
//     console.error("updateBotDb error:", error)
//     throw error
//   }
// }

// const getBotByToken = async (token: string) => {
//   try {
//     await requireUser()
//     return await prisma.telegramBot.findUnique({
//       where: { token },
//       include: { chats: true },
//     })
//   } catch (error) {
//     console.error("getBotByToken error:", error)
//     throw error
//   }
// }

// const getUserTelegramInfo = async (tgUserId: string) => {
//   try {
//     await requireUser()
//     return await prisma.telegramUserInfo.findUnique({
//       where: { tgUserId },
//       include: {
//         chats: {
//           include: { bot: true },
//         },
//         user: true,
//       },
//     })
//   } catch (error) {
//     console.error("getUserTelegramInfo error:", error)
//     throw error
//   }
// }
