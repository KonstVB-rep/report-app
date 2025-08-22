"use server";

import { NextResponse } from "next/server";

import axios from "axios";

import { createUserTelegramChat } from "@/feature/createTelegramChatBot/api";
import { createTelegramBot } from "@/feature/createTelegramChatBot/api";
import prisma from "@/prisma/prisma-client";

const TELEGRAM_API_URL = process.env.TELEGRAM_API_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.message) {
      const { chat, text, from } = body.message;
      const chatId = chat.id;

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

        const botInDb = await prisma.telegramBot.findUnique({
          where: { botName },
        });

        let bot = undefined

        if (!botInDb) {
           bot = await createTelegramBot(botName, token);
        }


        if (!bot) {
          console.error("Бот не найден или не удалось создать");
          return NextResponse.json(
            { status: "Бот не найден или не удалось создать" },
            { status: 500 }
          );
        }

        const telegramUsername = from?.username ?? "Никнейм не указан";
        const telegramUserId = from.id;

        const chat = await prisma.userTelegramChat.findUnique({
          where: { botId_chatId: { botId: bot.id, chatId } },
        });

        if (chat) {
          await axios.post(`${TELEGRAM_API_URL}${token}/sendMessage`, {
            chat_id: chatId,
            text: `Привет, ${telegramUsername}! Ты уже подписан на уведомления.`,
          });
          return NextResponse.json({ status: "Пользователь уже подписан" });
        }

        await createUserTelegramChat(
          userId,
          botName,                
          chatId,
          String(telegramUserId),         
          nameChat,
        );
        await axios.post(`${TELEGRAM_API_URL}${token}/sendMessage`, {
          chat_id: chatId,
          text: `Привет, ${telegramUsername}! Ты успешно подписан на уведомления.`,
        });

        return NextResponse.json({ status: "Пользователь подписан" });
      }
    }

    return NextResponse.json({ status: "No action taken" });
  } catch (error) {
    console.error("Ошибка при обработке Telegram Webhook:", error);
    return NextResponse.json({ status: "Error" }, { status: 500 });
  }
}
