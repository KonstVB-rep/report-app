'use server'

import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";
import { EventInputType } from "../types";


export const createEventCalendar = async (eventData: {
  title: string;
  start: string;
  end: string;
  allDay?: boolean
}) => {
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


export const updateEventCalendar = async (eventData: {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean
}) => {
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
        allDay
      },
    });

    return updatedEvent;
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};


export const deleteEventCalendar = async (id: string) => {
  try {
    const data = await handleAuthorization();
    if (!data) throw new Error("Не авторизован");
    const { userId } = data;

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
        start: 'asc', 
      },
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay:event.allDay
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};
