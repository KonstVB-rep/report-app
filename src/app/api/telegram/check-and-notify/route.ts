import { NextResponse } from "next/server";

import axios from "axios";

import {
  getEventsCalendarUserToday,
  getInfoChatNotificationChecked,
} from "@/feature/calendar/api/calendar-bot/server";
import { EventInputType } from "@/feature/calendar/types";

async function sendNotificationsToTelegram(
  events: (EventInputType & { chatId: string })[]
) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/telegram/notify`,
      events,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Уведомления отправлены:", response.data.message);
    return response.data.message;
  } catch (error) {
    console.error("❌ Ошибка при отправке уведомлений:", error);
    throw error;
  }
}

export async function GET() {
  try {
    const allChats = await getInfoChatNotificationChecked(); // Возвращает все активные чаты с chatId

    if (!allChats.length) {
      return NextResponse.json({ message: "Нет активных чатов" });
    }

    const now = new Date();
    now.setSeconds(0, 0); // Убираем секунды и миллисекунды для точного сравнения

    for (const chat of allChats) {
      if (!chat.isActive || !chat.chatId || !chat.userId) continue;

      const events = await getEventsCalendarUserToday(chat.userId);
      if (!events?.length) continue;

      const upcomingEvents = events.filter((event) => {
        const eventStartTime = new Date(event.start);
        const thirtyMinutesBefore = new Date(
          eventStartTime.getTime() - 30 * 60 * 1000
        );
        const fifteenMinutesBefore = new Date(
          eventStartTime.getTime() - 15 * 60 * 1000
        );
        const exactStart = new Date(eventStartTime);

        thirtyMinutesBefore.setSeconds(0, 0);
        fifteenMinutesBefore.setSeconds(0, 0);
        exactStart.setSeconds(0, 0);

        return (
          (now.getTime() === thirtyMinutesBefore.getTime() ||
            now.getTime() === fifteenMinutesBefore.getTime() ||
            now.getTime() === exactStart.getTime()) &&
          now <= eventStartTime
        );
      });

      if (upcomingEvents.length > 0) {
        const eventsWithChatId = upcomingEvents.map((event) => ({
          ...event,
          chatId: String(chat.chatId),
        }));

        // console.log(
        //   `🔔 Отправка для пользователя ${chat.userId} (${chat.chatId}):`,
        //   eventsWithChatId.map((e) => e.title).join(", ")
        // );

        await sendNotificationsToTelegram(eventsWithChatId);
      }
    }

    return NextResponse.json({ message: "Проверка завершена" });
  } catch (error) {
    console.error("Ошибка в check-and-notify:", error);
    return NextResponse.json(
      { message: "Ошибка при проверке уведомлений" },
      { status: 500 }
    );
  }
}
