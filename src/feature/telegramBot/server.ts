'use server'
import axiosInstance from "@/shared/api/axiosInstance";
import { EventInputType } from "@/feature/calendar/types";

export async function getInfoChatNotificationChecked() {
  const response = await axiosInstance.post(`/telegram/active-chats`);
  return response.data;
}

export async function getEventsCalendarUserToday(userId: string): Promise<EventInputType[]> {
  const response = await axiosInstance.get(`/events/today`, {
    params: { userId },
  });

  console.log(response.data)
  return response.data;
}