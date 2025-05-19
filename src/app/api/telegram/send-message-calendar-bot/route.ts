import { NextResponse } from "next/server";

import axios from "axios";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { message, chatId, botName } = data.body;

    if (!message || !chatId) {
      return NextResponse.json(
        { error: "Не переданы обязательные параметры message или chatId" },
        { status: 400 }
      );
    }

    const resolvedBotName = botName ?? "";

    if (!resolvedBotName) {
      return NextResponse.json(
        { error: "Bot token не найден в переменных окружения" },
        { status: 500 }
      );
    }

    const telegramUrl = `${process.env.TELEGRAM_API_URL}${process.env.TELEGRAM_BOT_TOKEN_ERTEL_REPORT_APP_BOT}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    const response = await axios.post(telegramUrl, {
      chat_id: chatId,
      text: message,
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Ошибка при обработке уведомлений:", error);
    return NextResponse.json(
      { message: "Ошибка при отправке уведомлений" },
      { status: 500 }
    );
  }
}
