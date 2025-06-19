import axios from "axios";

import { getTelegramBotInDb } from "@/shared/api/getTelegramBotInDb";
import { NextResponse } from "next/server";
import axiosInstance from "@/shared/api/axiosInstance";

export async function sendTelegramMessage(
  botToken: string,
  chatId: number | string,
  text: string
) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const body = {
    chat_id: chatId,
    text,
    parse_mode: "HTML", // можно и Markdown
  };

  try {
    return await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Ошибка отправки сообщения в Telegram:", error);
    throw error;
  }
}

export async function notifyOrder(
  botName: string,
  userId: string,
  message: string
) {
  try {
    const bot = await getTelegramBotInDb(botName, userId);

    if (!bot?.chatName) {
      console.warn(`notifyManager: не найден чат для пользователя ${userId}`);
      return false;
    }

    await sendTelegramMessage(bot.token, bot.chatId, message);

    return true; // успешно
  } catch (error) {
    console.error("notifyOrder: ошибка при отправке уведомления", error);
    return false; // ошибка
  }
}


export async function sendNotification(botName: string, userId: string, message: string) {
  try {
    await axiosInstance.post('/telegram/order-queue-bot', { botName, userId, message }, { 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Ошибка запроса:', err);
    return NextResponse.json({ success: false });
  }
}