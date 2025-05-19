"use server";

import { NextResponse } from "next/server";

import axios from "axios";

import {
  createTelegramBot,
  createUserTelegramChat,
} from "@/feature/telegramBot/api";

const TELEGRAM_API_URL = process.env.TELEGRAM_API_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.message) {
      const { chat, text, from } = body.message;
      const chatId = chat.id;

      // Проверяем, что это команда `/start` и что у нее есть параметр
      if (text.startsWith("/start")) {
        const params = text.split(" ");
        const action = params[1];

        const userId = action.split("-")[0];

        if (!userId) {
          throw new Error(
            "Не удалось получить ID пользователя из Telegram команды"
          );
        }

        const botName = action.split("-")[1];
        const nameChat = action.split("-")[2];

        const token =
          process.env[`TELEGRAM_BOT_TOKEN_${botName.toUpperCase()}`];

        if (!token) {
          console.error(`Токен для бота ${botName} не найден в .env`);
          return NextResponse.json(
            { status: "Токен бота не найден" },
            { status: 500 }
          );
        }

        const bot = await createTelegramBot(botName, token);

        if (!bot) {
          console.error("Бот не найден или не удалось создать");
          return NextResponse.json(
            { status: "Бот не найден или не удалось создать" },
            { status: 500 }
          );
        }

        const telegramUsername = from?.username ?? "Никнейм не указан";
        const telegramUserId = from.id;

        await createUserTelegramChat(
          userId,
          chatId,
          telegramUserId,
          telegramUsername,
          nameChat,
          bot.botName,
          bot.token
        );

        // Допустим, вы хотите отправить приветственное сообщение
        await axios.post(`${TELEGRAM_API_URL}${token}/sendMessage`, {
          chat_id: chatId,
          text: `Привет, ${telegramUsername}! Ты успешно зарегистрирован.
Уведомления будут приходить за 30 минут до события.`,
        });

        return NextResponse.json({ status: "Пользователь зарегистрирован" });
      }
    }

    return NextResponse.json({ status: "No action taken" });
  } catch (error) {
    console.error("Ошибка при обработке Telegram Webhook:", error);
    return NextResponse.json({ status: "Error" }, { status: 500 });
  }
}
