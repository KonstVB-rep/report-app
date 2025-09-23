import { NextResponse } from "next/server";

import axios from "axios";

import {
  getEventsCalendarUserTodayRoute,
  getInfoChatNotificationChecked,
} from "@/feature/calendar/api/server";
import { EventInputType } from "@/feature/calendar/types";
import prisma from "@/prisma/prisma-client";

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

      const events = await getEventsCalendarUserTodayRoute(chat.userId);
      if (!events?.length) continue;

      const isNowBetween = (time: Date) => {
        const diff = Math.abs(now.getTime() - time.getTime());
        return diff <= 60 * 1000; // допускаем погрешность в 1 минуту
      };

      const upcomingEvents = events.filter((event) => {
        const eventStartTime = new Date(event.start);
        const thirtyMinutesBefore = new Date(
          eventStartTime.getTime() - 30 * 60 * 1000
        );
        const fifteenMinutesBefore = new Date(
          eventStartTime.getTime() - 15 * 60 * 1000
        );

        return (
          (isNowBetween(thirtyMinutesBefore) ||
            isNowBetween(fifteenMinutesBefore) ||
            isNowBetween(eventStartTime)) &&
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

    // === Новый блок: проекты с plannedDateConnection ===
    // Проверяем: если сейчас 09:00 по Москве, отправляем уведомления
    const moscowNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Moscow" })
    );

    if (moscowNow.getHours() === 9 && moscowNow.getMinutes() === 0) {
      const today = new Date(moscowNow);
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      );

      for (const chat of allChats) {
        if (!chat.isActive || !chat.chatId || !chat.userId) continue;

        const projectsToday = await prisma.project.findMany({
          where: {
            userId: chat.userId,
            plannedDateConnection: {
              gte: start,
              lte: end,
            },
          },
          select: { id: true, nameDeal: true, plannedDateConnection: true },
        });

        if (projectsToday.length > 0) {
          const notifications = projectsToday
            .filter((project) => project.plannedDateConnection !== null)
            .map((project) => ({
              chatId: String(chat.chatId),
              title: `Сегодня плановая дата контакта по сделке: ${project.nameDeal}`,
              start: project.plannedDateConnection as Date,
            }));

          await sendNotificationsToTelegram(notifications);
        }
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
