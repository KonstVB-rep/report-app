"use server";

import { endOfDay, startOfDay } from "date-fns";

import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import axiosInstance from "@/shared/api/axiosInstance";
import { handleError } from "@/shared/api/handleError";

import { EventDataType, EventInputType } from "../types";

export const createEventCalendar = async (
  eventData: Omit<EventDataType, "id">
) => {
  try {
    const data = await handleAuthorization();
    const { userId } = data!;
    const { title, start, end, allDay = false } = eventData;
    const newEvent = await prisma.eventCalendar.create({
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        allDay,
        userId,
      },
    });

    return newEvent;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const updateEventCalendar = async (eventData: EventDataType) => {
  try {
    const data = await handleAuthorization();
    const { userId } = data!;
    const { id, title, start, end, allDay = false } = eventData;

    // Проверка: принадлежит ли событие текущему пользователю
    const existingEvent = await prisma.eventCalendar.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingEvent) {
      throw new Error("Событие не найдено или нет прав на редактирование");
    }

    const updatedEvent = await prisma.eventCalendar.update({
      where: { id },
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        allDay,
        notified: false,
      },
    });

    return updatedEvent;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const deleteEventCalendar = async (eventData: { id: string }) => {
  try {
    const data = await handleAuthorization();
    if (!data) throw new Error("Не авторизован");
    const { userId } = data;

    const { id } = eventData;

    const existingEvent = await prisma.eventCalendar.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingEvent) {
      throw new Error("Событие не найдено или нет прав на редактирование");
    }

    const deletedEvent = await prisma.eventCalendar.delete({
      where: { id },
    });

    return deletedEvent;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getEventsCalendarUser = async (): Promise<EventInputType[]> => {
  try {
    const data = await handleAuthorization();
    const { userId } = data!;
    const events = await prisma.eventCalendar.findMany({
      where: { userId },
      orderBy: {
        start: "asc",
      },
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: event.allDay,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getEventsCalendarUserToday = async (): Promise<
  EventInputType[]
> => {
  try {
    const data = await handleAuthorization();
    const { userId } = data!;

    // Получаем начало и конец сегодняшнего дня
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Запрашиваем события, которые происходят в пределах сегодняшнего дня
    const events = await prisma.eventCalendar.findMany({
      where: {
        userId,
        start: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: {
        start: "asc",
      },
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: event.allDay,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function getCalendarBotName(): Promise<string | null> {
  const botName = process.env.TELEGRAM_BOT_ERTEL_REPORT_APP_NAME;
  return botName ?? null;
}

export const sendNotification = async (
  message: string,
  chatId: string,
  botName: string
) => {
  try {
    await axiosInstance.post(
      `/telegram/send-message-calendar-bot`,
      {
        message,
        chatId,
        botName,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { status: "success" };
  } catch (error) {
    console.error("Ошибка при отправке:", error);
  }
};
