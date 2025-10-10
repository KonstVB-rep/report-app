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

// Глобальные функции кеша (не создаем каждый раз)
async function getCache(key: string) {
  const now = new Date();
  
  await prisma.notificationCache.deleteMany({
    where: { expiresAt: { lt: now } }
  });
  
  const cache = await prisma.notificationCache.findUnique({
    where: { key }
  });
  
  return cache ? cache.value : null;
}

async function setCache(key: string, value: string, ttlMinutes = 2) {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  
  await prisma.notificationCache.upsert({
    where: { key },
    update: { value, expiresAt },
    create: { key, value, expiresAt }
  });
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

        const notificationWindows = [
          {
            start: eventTime - 31 * 60 * 1000,
            end: eventTime - 29 * 60 * 1000,
          },
          {
            start: eventTime - 16 * 60 * 1000,
            end: eventTime - 14 * 60 * 1000,
          },
          { start: eventTime - 1 * 60 * 1000, end: eventTime + 1 * 60 * 1000 },
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

        // Проверяем кеш в БД
        const cacheKey = `chat_${chat.chatId}_events`;
        const lastSent = await getCache(cacheKey);
        const twoMinutesAgo = Date.now() - 3 * 60 * 1000;

        if (!lastSent || parseInt(lastSent) < twoMinutesAgo) {
          console.log(
            `🔔 Отправка для пользователя ${chat.userId} (${chat.chatId}):`,
            eventsWithChatId.map((e) => e.title).join(", ")
          );

          await sendNotificationsToTelegram(eventsWithChatId);
          
          // Сохраняем время отправки в БД
          await setCache(cacheKey, Date.now().toString());
        } else {
          console.log(
            `⏸️ Пропуск для чата ${chat.chatId} - уведомления уже отправлялись в последние 2 минуты`
          );
        }
      }
    }

    // === Блок для проектов ===
    const moscowNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Europe/Moscow" })
    );

    if (
      moscowNow.getHours() === 9 &&
      moscowNow.getMinutes() >= 0 &&
      moscowNow.getMinutes() <= 30
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

          // Проверяем кеш для проектов
          const projectCacheKey = `chat_${chat.chatId}_projects`;
          const lastProjectSent = await getCache(projectCacheKey);
          const twoMinutesAgo = Date.now() - 3 * 60 * 1000;

          if (!lastProjectSent || parseInt(lastProjectSent) < twoMinutesAgo) {
            console.log(
              `🔔 Утренние уведомления для чата ${chat.chatId}: ${projectsToday.length} проектов`
            );
            await sendNotificationsToTelegram(notifications);
            await setCache(projectCacheKey, Date.now().toString());
          } else {
            console.log(
              `⏸️ Пропуск проектов для чата ${chat.chatId} - уведомления уже отправлялись в последние 2 минуты`
            );
          }
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