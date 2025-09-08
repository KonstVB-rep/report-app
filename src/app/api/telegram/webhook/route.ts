// "use server";

// import { NextResponse } from "next/server";
// import axios from "axios";

// import prisma from "@/prisma/prisma-client";
// import { createTelegramBot, createUserTelegramChat } from "@/entities/tgBot/api";

// const TELEGRAM_API_URL = process.env.TELEGRAM_API_URL;

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     if (body.message) {
//       const { chat, text, from } = body.message;

//       const chatId = String(chat.id); 

//       if (text?.startsWith("/start")) { 
//         const params = text.split(" ");
//         const action = params[1];

//         const userId = action?.split("-")[0];

//         if (!userId) {
//           throw new Error(
//             "Не удалось получить ID пользователя из Telegram команды"
//           );
//         }

//         const botName = action.split("-")[1];
//         const nameChat = action.split("-")[2];

//         const token =
//           process.env[`TELEGRAM_BOT_TOKEN_${botName?.toUpperCase()}`]; 

//         if (!token) {
//           console.error(`Токен для бота ${botName} не найден в .env`);
//           return NextResponse.json(
//             { status: "Токен бота не найден" },
//             { status: 500 }
//           );
//         }

//         const botInDb = await prisma.telegramBot.findUnique({
//           where: { botName },
//         });

//         const bot = botInDb ?? (await createTelegramBot(botName, token, "не задано"));

//         if (!bot) {
//           console.error("Бот не найден или не удалось создать");
//           return NextResponse.json(
//             { status: "Бот не найден или не удалось создать" },
//             { status: 500 }
//           );
//         }

//         const telegramUsername = from?.username ?? "Никнейм не указан";
//         const telegramUserId = String(from.id);
        
//         // Получаем дополнительные данные из объекта from
//         const firstName = from?.first_name || null;
//         const lastName = from?.last_name || null;
//         const languageCode = from?.language_code || null;
//         const isBot = from?.is_bot || false;

//         const chatExists = await prisma.userTelegramChat.findUnique({
//           where: { botId_chatId: { botId: bot.id, chatId } },
//         });

//         if (chatExists) {
//           await axios.post(`${TELEGRAM_API_URL}${token}/sendMessage`, {
//             chat_id: chatId,
//             text: `Привет, ${telegramUsername}! Ты уже подписан на уведомления.`,
//           });
//           return NextResponse.json({ status: "Пользователь уже подписан" });
//         }

//         await createUserTelegramChat(
//           userId,
//           botName,
//           chatId,
//           {
//             tgUserId: telegramUserId,
//             tgUserName: telegramUsername,
//             firstName: firstName,
//             lastName: lastName,
//             languageCode: languageCode,
//             isBot: isBot
//           },
//           nameChat
//         );

//         await axios.post(`${TELEGRAM_API_URL}${token}/sendMessage`, {
//           chat_id: chatId,
//           text: `Привет, ${telegramUsername}! Ты успешно подписан на уведомления.`,
//         });

//         return NextResponse.json({ status: "Пользователь подписан" });
//       }
//     }

//     return NextResponse.json({ status: "No action taken" });
//   } catch (error) {
//     console.error("Ошибка при обработке Telegram Webhook:", error);
//     return NextResponse.json({ status: "Error" }, { status: 500 });
//   }
// }

"use server";

import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/prisma/prisma-client";
import { createTelegramBot, createUserTelegramChat } from "@/entities/tgBot/api";

const TELEGRAM_API_URL = process.env.TELEGRAM_API_URL;

// --- Типы ---
interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramChat {
  id: number | string;
  type: string;
}

interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
  contact?: {
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id?: number;
  };
}

// --- URL-safe Base64 ---
function decodeStartCommand(encoded: string): string {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - encoded.length % 4) % 4);
  return atob(base64);
}

// --- Отправка сообщения в Telegram ---
async function sendTelegramMessage(token: string, chatId: string, text: string) {
  await axios.post(`${TELEGRAM_API_URL}${token}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  });
}

// --- Обработка команды /start ---
async function handleStartCommand(encodedCommand: string, chatId: string, from: TelegramUser) {
  const decoded = decodeStartCommand(encodedCommand);
  const [userId, botName, chatNameRaw] = decoded.split("-");
  const chatName = chatNameRaw || `Чат с ${from.username ?? "Пользователь"}`;

  if (!userId || !botName) throw new Error("Неверные параметры команды /start");

  const token = process.env[`TELEGRAM_BOT_TOKEN_${botName.toUpperCase()}`];
  if (!token) throw new Error(`Токен для бота ${botName} не найден`);

  let bot = await prisma.telegramBot.findUnique({ where: { botName } });
  if (!bot) bot = await createTelegramBot(botName, token, "не задано");

  const existingChat = await prisma.userTelegramChat.findUnique({
    where: { botId_chatId: { botId: bot.id, chatId: String(chatId) } },
  });

  if (existingChat) {
    await sendTelegramMessage(token, String(chatId), `Вы уже подписаны на уведомления.`);
    return NextResponse.json({ status: "Пользователь уже подписан" });
  }

  await createUserTelegramChat(
    userId,
    botName,
    String(chatId),
    {
      tgUserId: String(from.id),
      tgUserName: from.username ?? undefined,
      firstName: from.first_name ?? undefined,
      lastName: from.last_name ?? undefined,
      languageCode: from.language_code ?? undefined,
      isBot: from.is_bot,
    },
    chatName
  );

  await sendTelegramMessage(token, String(chatId), `Вы успешно подписаны на уведомления ✅`);
  return NextResponse.json({ status: "Пользователь подписан" });
}

// --- Обработка обычного сообщения ---
async function handleRegularMessage(text: string, chatId: string) {
  if (text === "/help") {
    const token = process.env.TELEGRAM_BOT_TOKEN_DEFAULT;
    if (token) {
      await sendTelegramMessage(token, chatId, `Доступные команды:\n/start - подписка\n/help - справка`);
    }
  }
  return NextResponse.json({ status: "Regular message handled" });
}

// --- Обработка контакта (пусто, если не нужно) ---
async function handleContact() {
  return NextResponse.json({ status: "Contact handled" });
}

// --- Обработка callback query (пусто, если не нужно) ---
async function handleCallbackQuery() {
  return NextResponse.json({ status: "Callback handled" });
}

// --- Основной POST ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.message && !body.callback_query) return NextResponse.json({ status: "No action" });

    if (body.message) {
      const message: TelegramMessage = body.message;

      if (message.text?.startsWith("/start")) {
        const [, encodedCommand] = message.text.split(" ");
        return await handleStartCommand(encodedCommand, String(message.chat.id), message.from);
      }

      if (message.text) return await handleRegularMessage(message.text, String(message.chat.id));
      if (message.contact) return await handleContact();
    }

    if (body.callback_query) return await handleCallbackQuery();

    return NextResponse.json({ status: "No action taken" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { status: "Error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
