"use client";

import { useEffect, useState } from "react";
import { EventInputType } from "../types";
import { useNotification } from "@/app/provider/notification-provider";
import { useGetInfoChat } from "../hooks/query";

async function sendNotificationsToTelegram(events: EventInputType[]) {
  try {
    const response = await fetch('/api/telegram/notify', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(events), 
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

export default function NotificationChecker({chatName} :{ chatName:string}) {
    const { events } = useNotification();
    const [state, setState] = useState<boolean>(true);

    const {data: bot} = useGetInfoChat(chatName)

    useEffect(() => {


      if (!events?.length) {
        console.log('Нет событий или чат не активен');
        return;
      }

      if(!bot || !bot?.isActive || !bot.chatId){
        console.log('Нет бота или чат не активен');
        return
      }

        const id = setInterval(() => {
          console.log('interval')
          const now = new Date();
          now.setSeconds(0, 0); 
          const chatId = Number(bot.chatId); 
  
          const upcomingEvents = events.filter((event) => {
            const eventStartTime = new Date(event.start);
            const thirtyMinutesBefore = new Date(eventStartTime.getTime() - 31 * 60000);
            thirtyMinutesBefore.setSeconds(0,0)

            return now.getTime() === thirtyMinutesBefore.getTime() && now < eventStartTime;
          });
  
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
        }
      };
    }, [bot, bot?.isActive, events, state]); 

  return null;
}
