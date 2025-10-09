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
    const allChats = await getInfoChatNotificationChecked();

    if (!allChats.length) {
      return NextResponse.json({ message: "Нет активных чатов" });
    }

    const now = new Date();
    now.setSeconds(0, 0);

    for (const chat of allChats) {
      if (!chat.isActive || !chat.chatId || !chat.userId) continue;

      const events = await getEventsCalendarUserTodayRoute(chat.userId);
      if (!events?.length) continue;

      const upcomingEvents = events.filter((event) => {
        const eventStartTime = new Date(event.start);
        const nowTime = now.getTime();
        const eventTime = eventStartTime.getTime();

        // Определяем временные окна для уведомлений (окно 2 минуты)
        const notificationWindows = [
          {
            start: eventTime - 31 * 60 * 1000,
            end: eventTime - 29 * 60 * 1000,
          }, // окно 30 мин (±1 мин)
          {
            start: eventTime - 16 * 60 * 1000,
            end: eventTime - 14 * 60 * 1000,
          }, // окно 15 мин (±1 мин)
          { start: eventTime - 1 * 60 * 1000, end: eventTime + 1 * 60 * 1000 }, // окно начала (±1 мин)
        ];

        return (
          notificationWindows.some(
            (window) => nowTime >= window.start && nowTime <= window.end
          ) && nowTime <= eventTime
        );
      });

      if (upcomingEvents.length > 0) {
        const eventsWithChatId = upcomingEvents.map((event) => ({
          ...event,
          chatId: String(chat.chatId),
        }));

        console.log(
          `🔔 Отправка для пользователя ${chat.userId} (${chat.chatId}):`,
          eventsWithChatId.map((e) => e.title).join(", ")
        );

        await sendNotificationsToTelegram(eventsWithChatId);
      }
    }

    // === Блок для проектов с plannedDateConnection ===
    const moscowNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Moscow" })
    );

    // Расширяем окно для проверки 09:00 (±2 минуты)
    if (
      moscowNow.getHours() === 9 &&
      moscowNow.getMinutes() >= 0 &&
      moscowNow.getMinutes() <= 2
    ) {
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
