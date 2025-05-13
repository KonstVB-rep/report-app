"use client";

import { useEffect, useState } from "react";
import { EventInputType } from "../types";
import { useNotification } from "@/app/provider/notification-provider";

async function sendNotificationsToTelegram(events: EventInputType[]) {
  try {
    const response = await fetch('/api/notify', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(events), // отправляем массив целиком
    });

    if (!response.ok) {
        throw new Error(`Ошибка при отправке уведомления. Статус: ${response.status}`);
    }

    const data = await response.json();
    console.log("Уведомления отправлены: ", data);
  } catch (error) {
    console.error('Ошибка при отправке уведомлений:', error);
  }
}

export default function NotificationChecker() {
    const { events } = useNotification(); // Получаем события из контекста
    const [state, setState] = useState<boolean>(true); // Для хранения ID интервала

    useEffect(() => {

      if (!events?.length) {
        console.log('Нет событий');
        return;
      }
  
      // Запуск интервала, если его нет

        const id = setInterval(() => {
          console.log('interval');
  
          const now = new Date();
          now.setSeconds(0, 0); 
          const chatId = 1043614435; 
  
          const upcomingEvents = events.filter((event) => {
            const eventStartTime = new Date(event.start);
            const thirtyMinutesBefore = new Date(eventStartTime.getTime() - 30 * 60000);
            thirtyMinutesBefore.setSeconds(0,0)

            return now.getTime() === thirtyMinutesBefore.getTime() && now < eventStartTime;
          });
  
          console.log(upcomingEvents, 'upcomingEvents');
  
          if (upcomingEvents.length > 0) {

            const eventsWithChatId = upcomingEvents.map(event => ({
              ...event,
              chatId,
            }));
  
            console.log(`Отправляю уведомления для событий: ${upcomingEvents.map(e => e.title).join(", ")}`);
            sendNotificationsToTelegram(eventsWithChatId); 
            setState(prev => !prev);
          }
        }, 60000);
  
      return () => {
        if (id) {
          clearInterval(id);
          console.log('Interval cleared');
        }
      };
    }, [events, state]); 

  return null;
}
