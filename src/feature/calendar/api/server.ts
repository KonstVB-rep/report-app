"use server"

import type { Chat, EventInputType } from "@/feature/calendar/types"
import axiosInstance from "@/shared/api/axiosInstance"

export async function getInfoChatNotificationChecked(): Promise<Chat[]> {
  const response = await axiosInstance.post(`/telegram/active-chats`)
  return response.data
}

export async function getEventsCalendarUserTodayRoute(userId: string): Promise<EventInputType[]> {
  const response = await axiosInstance.get(`/events/today`, {
    params: { userId },
  })

  return response.data
}
