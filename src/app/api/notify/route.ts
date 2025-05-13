import { NextRequest, NextResponse } from "next/server";

import axios from "axios";

import { EventInputType } from "@/feature/calendar/types";

// 🔔 Функция для отправки уведомления
async function sendNotification(message: string, chatId: string) {
  try {
    console.log(process.env.TELEGRAM_API_URL,'*********************process.env.TELEGRAM_API_URL')
    const response = await axios.post(`${process.env.TELEGRAM_API_URL}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`);

    return response;
  } catch (error) {
    console.error("Ошибка при отправке уведомления:", error);
  }
}

export type EventInputTypeWithChatId = EventInputType & {
  chatId: string;
};

// 🔄 Основной POST метод
export async function POST(req: NextRequest) {
  try {
    const events = await req.json(); // Получаем массив событий

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { message: "Неверные данные: ожидается массив событий" },
        { status: 400 }
      );
    }

    // Перебираем все события и отправляем уведомления
    for (const event of events) {
      const { title, start, chatId } = event;

      if (!title || !start || !chatId) {
        return NextResponse.json(
          {
            message:
              "Неверные данные: отсутствуют необходимые поля в одном из событий",
          },
          { status: 400 }
        );
      }

      const message = `Напоминание: через 30 минут начинается событие: ${title}`;

      try {
        // Отправляем уведомление в Telegram
        await sendNotification(message, chatId);

      } catch (error) {
        console.error(
          `Ошибка при отправке уведомления для события: ${title}`,
          error
        );

      }
    }

    return NextResponse.json({ message: "Уведомления отправлены успешно" });
  } catch (error) {
    console.error("Ошибка при обработке уведомлений:", error);
    return NextResponse.json(
      { message: "Ошибка при отправке уведомлений" },
      { status: 500 }
    );
  }
}


