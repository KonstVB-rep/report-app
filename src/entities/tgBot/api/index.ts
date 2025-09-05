'use server'

import { Prisma, UserTelegramChat } from "@prisma/client";

import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { checkRole } from "@/shared/api/checkRole";
import { handleError } from "@/shared/api/handleError";


import { revalidatePath } from "next/cache";
import { BotWithChats } from "../types";

// export const createTelegramBot = async (botName: string, token: string, description: string) => {
//   try {
//     await handleAuthorization();
//     await checkRole();

//     const bot = await prisma.telegramBot.findUnique({
//       where: { botName, token },
//       include: { chats: true },
//     });

//     if (bot) {
//       return bot;
//     }

//     const newBot = await prisma.telegramBot.create({
//       data: { botName, token, description },
//     });
//     return newBot;
//   } catch (error) {
//     console.error(error);
//     throw handleError(
//       typeof error === "string" ? error : "Ошибка записи Telegram данных"
//     );
//   }
// };

// export const deleteTelegramBot = async (botName: string, token: string) => {
//   try {
//     await handleAuthorization();
//     await checkRole();

//     const bot = await prisma.telegramBot.findUnique({
//       where: { botName, token },
//       include: { chats: true },
//     });

//     if (!bot) {
//       throw new Error("Телеграм бот не найден");
//     }

//     const deletedBot = await prisma.telegramBot.delete({
//       where: { id: bot.id },
//     });

//     await prisma.userTelegramChat.deleteMany({
//       where: { botId: bot.id },
//     });

//     return deletedBot;
//   } catch (error) {
//     console.error(error);
//     throw handleError(
//       typeof error === "string" ? error : "Ошибка записи Telegram данных"
//     );
//   }
// };

// export const getAllBots = async (): Promise<TelegramBot[]> => {
//   try {
//     await handleAuthorization();
//     await checkRole();

//     const bots = await prisma.telegramBot.findMany();

//     if (!bots) {
//       throw new Error("Телеграм чаты не найдены");
//     }

//     await prisma.userTelegramChat.findMany({});

//     return bots;
//   } catch (error) {
//     console.error(error);
//     throw handleError(
//       typeof error === "string" ? error : "Ошибка записи Telegram данных"
//     );
//   }
// };

// export const getChatsByBotId = async (botId: string) => {
//   try {
//     await handleAuthorization();
//     await checkRole();

//     const chats = await prisma.userTelegramChat.findMany({
//       where: {
//         botId,
//       },
//     });

//     if (!chats) {
//       throw new Error("Чаты не найдены");
//     }

//     return chats;
//   } catch (error) {
//     console.error(error);
//     throw handleError(
//       typeof error === "string" ? error : "Ошибка записи Telegram данных"
//     );
//   }
// };

// // export const getAllChatsBot = async () => {
// //   try {
// //     await handleAuthorization();
// //     await checkRole();;

// //     const chats = await prisma.userTelegramChat.findMany();

// //     if (!chats) {
// //       throw new Error("Телеграм боты не найден");
// //     }

// //     return chats;
// //   } catch (error) {
// //     console.error(error);
// //     throw handleError(
// //       typeof error === "string" ? error : "Ошибка записи Telegram данных"
// //     );
// //   }
// // };

// export const createUserTelegramChat = async (
//   userId: string,
//   botName: string,
//   chatId: string,
//   telegramUserInfoId: string,
//   chatName: string,
//   username: string,
//   isActive = true
// ): Promise<{ success: boolean; message: string }> => {
//   try {

//     await handleAuthorization();
//     await checkRole();

//     const bot = await prisma.telegramBot.findUnique({
//       where: { botName },
//     });

//     if (!bot) {
//       return {
//         success: false,
//         message: "Бот не найден в системе",
//       };
//     }

//     let telegramUserInfo = await prisma.telegramUserInfo.findUnique({
//       where: { tgUserId: telegramUserInfoId },
//     });

//     if (!telegramUserInfo) {
//       telegramUserInfo = await prisma.telegramUserInfo.create({
//         data: {
//           tgUserId: telegramUserInfoId,
//           tgUserName: username,
//           botId: bot.id,
//           userId: userId,
//         },
//       });
//     }

//     const existingChat = await prisma.userTelegramChat.findUnique({
//       where: {
//         botId_chatId: {
//           botId: bot.id,
//           chatId: String(chatId),
//         },
//       },
//     });

//     if (existingChat) {
//       return {
//         success: false,
//         message: "Чат уже существует",
//       };
//     }

//     await prisma.userTelegramChat.create({
//       data: {
//         userId,
//         botId: bot.id,
//         chatId: String(chatId),
//         telegramUserInfoId,
//         chatName,
//         isActive,
//       },
//     });

//     return {
//       success: true,
//       message: "Чат успешно создан",
//     };
//   } catch (error) {
//     console.error("Ошибка создания Telegram чата:", error);

//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       if (error.code === "P2002") {
//         return {
//           success: false,
//           message: "Чат уже существует",
//         };
//       }
//     }

//     return {
//       success: false,
//       message: "Ошибка создания Telegram чата",
//     };
//   }
// };

// export const updateUserTelegramChat = async (
//   userId: string,
//   botName: string,
//   chatId: string,
//   telegramUserInfoId: string,
//   chatName: string,
//   isActive: boolean
// ): Promise<{ success: boolean; message: string }> => {
//   try {

//   //   userId             String // ID пользователя в вашей системе
//   // botId              String // ID бота
//   // chatId             String // ID чата в Telegram
//   // telegramUserInfoId String // ID информации о Telegram пользователе
//   // chatName           String?
//   // isActive           Boolean  @default(true)

//     await handleAuthorization();
//     await checkRole();

//     const bot = await prisma.telegramBot.findUnique({
//       where: { botName },
//     });

//     if (!bot) {
//       return {
//         success: false,
//         message: "Бот не найден в системе",
//       };
//     }


//     const existingChat = await prisma.userTelegramChat.findUnique({
//       where: {
//         botId_chatId: {
//           botId: bot.id,
//           chatId: String(chatId),
//         },
//       },
//     });

//     if (existingChat) {
//       return {
//         success: false,
//         message: "Чат уже существует",
//       };
//     }

 

//     await prisma.userTelegramChat.update({
//       where: {
//         botId_chatId: {
//           botId: bot.id,
//           chatId: String(chatId),
//         },
//       },
//       data: {
//         userId,
//         botId: bot.id,
//         chatId: String(chatId),
//         telegramUserInfoId,
//         chatName,
//         isActive,
//       },
//     });

//     return {
//       success: true,
//       message: "Чат успешно обновлен",
//     };
//   } catch (error) {
//     console.error("Ошибка обновления Telegram чата:", error);}

//     return {
//       success: false,
//       message: "Ошибка обновления Telegram чата",
//     };
//   }


// export const toggleSubscribeChatBot = async (chatBotData: ChatBotType) => {
//   const { chatName, chatId, isActive } = chatBotData;
//   if (!chatName) {
//     throw new Error("chatName не может быть пустым");
//   }

//   try {
//     const existingChat = await prisma.userTelegramChat.findUnique({
//       where: {
//         botId_chatId: {
//           botId: chatName,
//           chatId,
//         },
//       },
//     });

//     if (!existingChat) {
//       throw new Error(`Чат не найден в базе`);
//     }

//     const updatedChat = await prisma.userTelegramChat.update({
//       where: {
//         botId_chatId: {
//           botId: chatName,
//           chatId,
//         },
//       },
//       data: { isActive },
//     });

//     return updatedChat;
//   } catch (error) {
//     console.error("Ошибка отписки:", error);
//     throw error;
//   }
// };

// export const deleteChat = async (chatId: string) => {
//   try {

//     await handleAuthorization();
//     await checkRole();
//     const result = await prisma.userTelegramChat.delete({
//       where: {
//         id: chatId,
//       },
//     });

//     return result;
//   } catch (error) {
//     console.error("Ошибка удаления чата:", error);
//     throw error;
//   }
// };

// export const updateBotDb = async (data:{botName: string,description: string, token: string}) => {
//   try {

//     await handleAuthorization();
//     await checkRole();

//     const result = await prisma.telegramBot.update({
//       where: {
//         botName: data.botName,
//       },
//       data: {
//         botName: data.botName,
//         description: data.description,
//         token: data.token
//       }
//     });
//     return result;
//   } catch (error) {
//     console.error("Ошибка обновления бота:", error);
//     throw error;
//   }
// };



export const createTelegramBot = async (botName: string, token: string, description: string) => {
  try {
    await handleAuthorization();
    await checkRole();

    // Проверяем существование бота по имени или токену
    const existingBot = await prisma.telegramBot.findFirst({
      where: {
        OR: [
          { botName },
          { token }
        ]
      }
    });

    if (existingBot) {
      throw new Error("Бот с таким именем или токеном уже существует");
    }

    const newBot = await prisma.telegramBot.create({
      data: { botName, token, description },
      include: { chats: true }
    });
    
    return newBot;
  } catch (error) {
    console.error(error);
    throw handleError(
      typeof error === "string" ? error : "Ошибка создания Telegram бота"
    );
  }
};

export const deleteTelegramBot = async (botName: string, token: string) => {
  try {
    await handleAuthorization();
    await checkRole();

    const bot = await prisma.telegramBot.findUnique({
      where: { botName },
      include: { chats: true }
    });

    if (!bot) {
      throw new Error("Телеграм бот не найден");
    }

    if (bot.token !== token) {
      throw new Error("Неверный токен для данного бота");
    }

    // Удаляем связанные чаты (каскадное удаление должно сработать автоматически)
    await prisma.userTelegramChat.deleteMany({
      where: { botId: bot.id }
    });

    const deletedBot = await prisma.telegramBot.delete({
      where: { id: bot.id }
    });

    return deletedBot;
  } catch (error) {
    console.error(error);
    throw handleError(
      typeof error === "string" ? error : "Ошибка удаления Telegram бота"
    );
  }
};

export const getAllBots = async (): Promise<BotWithChats[]> => {
  try {
    await handleAuthorization();
    await checkRole();

    const bots = await prisma.telegramBot.findMany({
  select: {
    id: true,
    botName: true,
    token: true,
    description: true,
    chats: {
      select: {
        id: true,
        userId: true,
        botId: true,
        chatId: true,
        chatName: true,
        isActive: true,
        telegramUserInfoId: true,
      },
    },
  },
});

    if (!bots || bots.length === 0) {
      throw new Error("Телеграм боты не найдены");
    }

    return bots;
  } catch (error) {
    console.error(error);
    throw handleError(
      typeof error === "string" ? error : "Ошибка получения Telegram ботов"
    );
  }
};

export const getChatsByBotId = async (botId: string) => {
  try {
    await handleAuthorization();
    await checkRole();

    const chats = await prisma.userTelegramChat.findMany({
      where: { botId },
      include: {
        telegramUserInfo: true,
        user: true,
        bot: true
      }
    });

    return chats || [];
  } catch (error) {
    console.error(error);
    throw handleError(
      typeof error === "string" ? error : "Ошибка при получении чатов"
    );
  }
};

export const createUserTelegramChat = async (
  userId: string,
  botName: string,
  chatId: string,
  telegramUserInfoData: {
    tgUserId: string;
    tgUserName?: string;
    firstName?: string;
    lastName?: string;
    languageCode?: string;
    isBot?: boolean;
  },
  chatName: string,
  isActive = true
): Promise<{ success: boolean; message: string }> => {
  try {
    await handleAuthorization();
    await checkRole();

    const bot = await prisma.telegramBot.findUnique({
      where: { botName }
    });

    if (!bot) {
      return {
        success: false,
        message: "Бот не найден в системе"
      };
    }

    // Ищем или создаем информацию о пользователе Telegram
    let telegramUserInfo = await prisma.telegramUserInfo.findUnique({
      where: { tgUserId: telegramUserInfoData.tgUserId }
    });

    if (!telegramUserInfo) {
      telegramUserInfo = await prisma.telegramUserInfo.create({
        data: {
          ...telegramUserInfoData,
          userId: userId
        }
      });
    }

    // Проверяем существование чата
    const existingChat = await prisma.userTelegramChat.findUnique({
      where: {
        botId_chatId: {
          botId: bot.id,
          chatId: chatId
        }
      }
    });

    if (existingChat) {
      return {
        success: false,
        message: "Чат уже существует"
      };
    }

    // Создаем чат
    await prisma.userTelegramChat.create({
      data: {
        userId,
        botId: bot.id,
        chatId,
        telegramUserInfoId: telegramUserInfo.id,
        chatName,
        isActive
      },
    });

    return {
      success: true,
      message: "Чат успешно создан",
    };
  } catch (error) {
    console.error("Ошибка создания Telegram чата:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Чат уже существует"
        };
      }
    }

    return {
      success: false,
      message: "Ошибка создания Telegram чата"
    };
  }
};

export const updateUserTelegramChat = async (
data: {
  botId: string;
  chatId: string;
  chatName: string;
  isActive: boolean;}
): Promise<{ success: boolean; message: string, result?: UserTelegramChat }> => {
  try {
    await handleAuthorization();
    await checkRole();

    const { botId, chatId, chatName, isActive } = data;

    const bot = await prisma.telegramBot.findUnique({
      where: { id: botId },
    });

    if (!bot) {
      return {
        success: false,
        message: "Бот не найден в системе"
      };
    }

    // Находим чат
    const chat = await prisma.userTelegramChat.findUnique({
      where: {
        botId_chatId: {
          botId: bot.id,
          chatId
        }
      },
      include: { telegramUserInfo: true }
    });

    if (!chat) {
      return {
        success: false,
        message: "Чат не найден"
      };
    }

    // Обновляем сам чат
    const result =await prisma.userTelegramChat.update({
      where: {
        botId_chatId: {
          botId: bot.id,
          chatId
        }
      },
      data: {
        chatName,
        isActive
      }
    });

    return {
      success: true,
      message: "Чат успешно обновлен",
      result
    };
  } catch (error) {
    console.error("Ошибка обновления Telegram чата:", error);
    return {
      success: false,
      message: "Ошибка обновления Telegram чата"
    };
  }
};

export const toggleSubscribeChatBot = async (data: { botId: string; chatId: string; isActive: boolean }) => {
  try {
    await handleAuthorization();
    await checkRole();

    const { botId, chatId, isActive } = data;

    const bot = await prisma.telegramBot.findUnique({
      where: { id: botId }
    });

    if (!bot) {
      throw new Error("Бот не найден");
    }

    const existingChat = await prisma.userTelegramChat.findUnique({
      where: {
        botId_chatId: {
          botId: bot.id,
          chatId
        }
      }
    });

    if (!existingChat) {
      throw new Error("Чат не найден");
    }

    const updatedChat = await prisma.userTelegramChat.update({
      where: {
        botId_chatId: {
          botId: bot.id,
          chatId
        }
      },
      data: { isActive }
    });

    return updatedChat;
  } catch (error) {
    console.error("Ошибка изменения подписки:", error);
    throw error;
  }
};

export const deleteChat = async (data: {botName: string, chatId: string}) => {
  try {
    await handleAuthorization();
    await checkRole();

    const { botName, chatId } = data;

    console.log(botName, chatId, 'deleteChat');

    const bot = await prisma.telegramBot.findUnique({
      where: { botName }
    });

    if (!bot) {
      throw new Error("Бот не найден");
    }

    return await prisma.userTelegramChat.delete({
      where: {
        botId_chatId: {
          botId: bot.id,
          chatId
        }
      }
    });
  } catch (error) {
    console.error("Ошибка удаления чата:", error);
    throw error;
  }
};

export const deleteBot = async (data: { botName: string, pathName: string }) => {
  try {
    await handleAuthorization();
    await checkRole();

    // Сначала находим бота
    const bot = await prisma.telegramBot.findUnique({
      where: {
        botName: data.botName,
      },
      include: {
        chats: true // Включаем связанные чаты для информации
      }
    });

    if (!bot) {
      throw new Error("Бот не найден");
    }

    // Удаляем связанные чаты (каскадное удаление должно сработать автоматически,
    // но лучше явно удалить для чистоты)
    await prisma.userTelegramChat.deleteMany({
      where: { 
        botId: bot.id 
      }
    });

    // Удаляем самого бота
    const result = await prisma.telegramBot.delete({
      where: {
        id: bot.id,
      }
    });

    revalidatePath(data.pathName);
    return result;
  } catch (error) {
    console.error("Ошибка удаления бота:", error);
    throw error;
  }
};


export const updateBotDb = async (data: { botName: string; description: string; token: string }) => {
  try {
    await handleAuthorization();
    await checkRole();

    // Проверяем, не используется ли новый токен другим ботом
    if (data.token) {
      const existingBotWithToken = await prisma.telegramBot.findFirst({
        where: {
          token: data.token,
          NOT: { botName: data.botName }
        }
      });

      if (existingBotWithToken) {
        throw new Error("Токен уже используется другим ботом");
      }
    }

    const result = await prisma.telegramBot.update({
      where: { botName: data.botName },
      data: {
        description: data.description,
        token: data.token
      }
    });
    
    return result;
  } catch (error) {
    console.error("Ошибка обновления бота:", error);
    throw error;
  }
};

// Дополнительные полезные функции
export const getBotByToken = async (token: string) => {
  try {
    const bot = await prisma.telegramBot.findUnique({
      where: { token },
      include: { chats: true }
    });

    return bot;
  } catch (error) {
    console.error("Ошибка получения бота по токену:", error);
    throw error;
  }
};

export const getUserTelegramInfo = async (tgUserId: string) => {
  try {
    const userInfo = await prisma.telegramUserInfo.findUnique({
      where: { tgUserId },
      include: {
        chats: {
          include: {
            bot: true
          }
        },
        user: true
      }
    });

    return userInfo;
  } catch (error) {
    console.error("Ошибка получения информации о пользователе Telegram:", error);
    throw error;
  }
};