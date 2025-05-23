import { NextRequest, NextResponse } from "next/server";

import axios from "axios";

import { EventInputType } from "@/feature/calendar/types";
import prisma from "@/prisma/prisma-client";

async function sendNotification(message: string, chatId: string) {
  try {
    const response = await axios.post(
      `${process.env.TELEGRAM_API_URL}${process.env.TELEGRAM_BOT_TOKEN_ERTEL_REPORT_APP_BOT}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`
    );

    return response;
  } catch (error) {
    console.error("Ошибка при отправке уведомления:", error);
  }
}

export type EventInputTypeWithChatId = EventInputType & {
  chatId: string;
};

export async function POST(req: NextRequest) {
  try {
    const events = await req.json();

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { message: "Неверные данные: ожидается массив событий" },
        { status: 400 }
      );
    }

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

      const message = `‼️Напоминание: в ${new Date(start).toLocaleString().split(', ')[1]} - ${title}`;

      try {
        // Отправляем уведомление в Telegram
          const sent =await sendNotification(message, chatId);
          
          if (sent?.status === 200) {
            await prisma.eventCalendar.update({
              where: { id: event.id },
              data: { notified: true },
            });
          }
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
