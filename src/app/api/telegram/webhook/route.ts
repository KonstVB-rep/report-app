"use server";

import { NextResponse } from "next/server";
import axios from "axios";

import prisma from "@/prisma/prisma-client";
import { createTelegramBot, createUserTelegramChat } from "@/entities/tgBot/api";

const TELEGRAM_API_URL = process.env.TELEGRAM_API_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.message) {
      const { chat, text, from } = body.message;

      const chatId = String(chat.id); 

      if (text?.startsWith("/start")) { 
        const params = text.split(" ");
        const action = params[1];

        const userId = action?.split("-")[0];

        if (!userId) {
          throw new Error(
            "Не удалось получить ID пользователя из Telegram команды"
          );
        }

        const botName = action.split("-")[1];
        const nameChat = action.split("-")[2];

        const token =
          process.env[`TELEGRAM_BOT_TOKEN_${botName?.toUpperCase()}`]; 

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

        const bot = botInDb ?? (await createTelegramBot(botName, token, "не задано"));

        if (!bot) {
          console.error("Бот не найден или не удалось создать");
          return NextResponse.json(
            { status: "Бот не найден или не удалось создать" },
            { status: 500 }
          );
        }

        const telegramUsername = from?.username ?? "Никнейм не указан";
        const telegramUserId = String(from.id);
        
        // Получаем дополнительные данные из объекта from
        const firstName = from?.first_name || null;
        const lastName = from?.last_name || null;
        const languageCode = from?.language_code || null;
        const isBot = from?.is_bot || false;

        const chatExists = await prisma.userTelegramChat.findUnique({
          where: { botId_chatId: { botId: bot.id, chatId } },
        });

        if (chatExists) {
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
          {
            tgUserId: telegramUserId,
            tgUserName: telegramUsername,
            firstName: firstName,
            lastName: lastName,
            languageCode: languageCode,
            isBot: isBot
          },
          nameChat
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