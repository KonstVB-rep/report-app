// "use client";

// import { useEffect, useRef } from "react";

// import { useGetEventsCalendarUserToday, useGetInfoChatNotificationChecked } from "../hooks/query";
// import { EventInputType } from "../types";
// import axiosInstance from "@/shared/api/axiosInstance";

// export async function sendNotificationsToTelegram(events: EventInputType[]) {

//   try {
//     const response = await axiosInstance.post("/telegram/notify", events,{
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     console.log(response.data.message);
//     return response.data.message;
//   } catch (error) {
//     console.error("Ошибка при отправке уведомлений:", error);
//     throw error
//   }
// }

// export default function NotificationChecker({ chatName }: { chatName: string }) {

//   const { data: events } = useGetEventsCalendarUserToday()
//   const { data: bot } = useGetInfoChatNotificationChecked(chatName);
//   const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {

//     if (!events?.length || !bot?.isActive || !bot.chatId) {
//       return;
//     }

//     intervalIdRef.current = setInterval(() => {
//       console.log("⏰ Интервал запущен");
//       console.log(events)
//       const now = new Date();
//       now.setSeconds(0, 0);
//       const chatId = Number(bot.chatId);

//       const upcomingEvents = events.filter((event) => {
//         const eventStartTime = new Date(event.start);
//         const thirtyMinutesBefore = new Date(eventStartTime.getTime() - 30 * 60000);
//         thirtyMinutesBefore.setSeconds(0, 0);
//         console.log(now.getTime(),thirtyMinutesBefore.getTime(), "now.getTime() === thirtyMinutesBefore.getTime()")
//         console.log(now, eventStartTime, "now < eventStartTime")
//         return (
//           now.getTime() === thirtyMinutesBefore.getTime() &&
//           now < eventStartTime
//         );
//       });

//        console.log(upcomingEvents,'upcomingEvents')

//       if (upcomingEvents.length > 0) {
//         const eventsWithChatId = upcomingEvents.map((event) => ({
//           ...event,
//           chatId,
//         }));

//         console.log(
//           `🔔 Отправляю уведомления: ${upcomingEvents
//             .map((e) => e.title)
//             .join(", ")}`
//         );
//         sendNotificationsToTelegram(eventsWithChatId);
//       }
//     }, 60000);
//     return () => {
//       if (intervalIdRef.current) {
//         clearInterval(intervalIdRef.current);
//       }
//     };
//   }, [bot,bot?.isActive,events]);


//   return <span style={{ display: "none" }}></span>;
// }
