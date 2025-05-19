"use client";

import { useEffect, useRef } from "react";

import { useNotification } from "@/app/provider/notification-provider";

import { useGetInfoChat } from "../hooks/query";
import { EventInputType } from "../types";

async function sendNotificationsToTelegram(events: EventInputType[]) {
  try {
    const response = await fetch("/api/telegram/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(events),
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка при отправке уведомления. Статус: ${response.status}`
      );
    }
    const data = await response.json();
    console.log("Уведомления отправлены: ", data);
    return data;
  } catch (error) {
    console.error("Ошибка при отправке уведомлений:", error);
  }
}

export default function NotificationChecker({ chatName }: { chatName: string }) {
  const { events } = useNotification();
  const { data: bot } = useGetInfoChat(chatName);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!events?.length || !bot?.isActive || !bot.chatId) {
      return;
    }

    console.log("⏰ Интервал запущен");

    intervalIdRef.current = setInterval(() => {
      const now = new Date();
      now.setSeconds(0, 0);
      const chatId = Number(bot.chatId);

      const upcomingEvents = events.filter((event) => {
        const eventStartTime = new Date(event.start);
        const thirtyMinutesBefore = new Date(eventStartTime.getTime() - 30 * 60000);
        thirtyMinutesBefore.setSeconds(0, 0);

        return (
          now.getTime() === thirtyMinutesBefore.getTime() &&
          now < eventStartTime
        );
      });

      if (upcomingEvents.length > 0) {
        const eventsWithChatId = upcomingEvents.map((event) => ({
          ...event,
          chatId,
        }));

        console.log(upcomingEvents,'upcomingEvents')

        console.log(
          `🔔 Отправляю уведомления: ${upcomingEvents
            .map((e) => e.title)
            .join(", ")}`
        );
        sendNotificationsToTelegram(eventsWithChatId);
      }
    }, 60000);
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [bot?.isActive, bot?.chatId, events]);

  // Фиктивный рендер, чтобы React не "выкидывал" компонент
  return <span style={{ display: "none" }}>NotificationChecker active</span>;
}
