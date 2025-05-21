'use server'
import axiosInstance from "@/shared/api/axiosInstance";
import { EventInputType } from "@/feature/calendar/types";

export async function getInfoChatNotificationChecked() {
  const response = await axiosInstance.get(`/telegram/active-chats`);
  return response.data;
}

export async function getEventsCalendarUserToday(userId: string): Promise<EventInputType[]> {
  const response = await axiosInstance.get(`/events/today`, {
    params: { userId },
  });
  return response.data;
}