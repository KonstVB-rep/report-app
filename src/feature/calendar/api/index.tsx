"use server"

import { Role } from "@prisma/client"
import { handleAuthorization } from "@/app/api/utils/handleAuthorization"
import { prisma } from "@/prisma/prisma-client"
import { checkRole } from "@/shared/api/checkByServer"
import { getTelegramChatBotInDb } from "@/shared/api/getTelegramChatBotInDb"
import { handleError } from "@/shared/api/handleError"
import type { EventDataType, EventInputType, EventResponse } from "../types"

export const createEventCalendar = async (eventData: Omit<EventDataType, "id">) => {
  try {
    const data = await handleAuthorization()

    const { userId } = data
    const { title, start, end, allDay = false } = eventData
    const newEvent = await prisma.eventCalendar.create({
      data: {
        title,
        start: new Date(start),
        end: end ? new Date(end) : "",
        allDay,
        userId,
      },
    })

    return newEvent
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const updateEventCalendar = async (eventData: EventDataType) => {
  try {
    const data = await handleAuthorization()

    const { userId } = data
    const { id, title, start, end, allDay = false } = eventData

    const existingEvent = await prisma.eventCalendar.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingEvent) {
      throw new Error("Событие не найдено или нет прав на редактирование")
    }

    const updatedEvent = await prisma.eventCalendar.update({
      where: { id },
      data: {
        title,
        start: new Date(start),
        end: end ? new Date(end) : "",
        allDay,
        notified: false,
      },
    })

    return updatedEvent
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const deleteEventCalendar = async (eventData: { id: string }) => {
  try {
    const data = await handleAuthorization()

    const { userId } = data

    const { id } = eventData

    const existingEvent = await prisma.eventCalendar.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingEvent) {
      throw new Error("Событие не найдено или нет прав на редактирование")
    }

    const deletedEvent = await prisma.eventCalendar.delete({
      where: { id },
    })

    return deletedEvent
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const deleteArrayEventsCalendar = async (eventData: { ids: string[] }) => {
  try {
    await handleAuthorization()

    const { ids } = eventData

    const existingEvents = await prisma.eventCalendar.findMany({
      where: {
        id: { in: ids },
      },
    })

    if (existingEvents.length !== ids.length) {
      throw new Error("Некоторые события не найдены или нет прав на удаление")
    }

    const deletedEvents = await prisma.eventCalendar.deleteMany({
      where: {
        id: { in: ids },
      },
    })

    return deletedEvents
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}
export const getEventsCalendarUser = async (): Promise<EventInputType[]> => {
  try {
    const data = await handleAuthorization()
    const events = await prisma.eventCalendar.findMany({
      where: { userId: data.userId },
      orderBy: { start: "asc" },
    })
    return events.map(mapEventDates)
  } catch (error) {
    console.error(error)
    return []
  }
}

// 2. Получить события ПО ДИАПАЗОНУ (Оптимизированный метод)
export const getEventsCalendarUserRange = async (
  start: Date,
  end: Date,
): Promise<EventInputType[]> => {
  try {
    const data = await handleAuthorization()
    const events = await prisma.eventCalendar.findMany({
      where: {
        userId: data.userId,
        start: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { start: "asc" },
    })
    return events.map(mapEventDates)
  } catch (error) {
    console.error(error)
    return []
  }
}

// 3. Получить ВСЕ (Админ)
export const getAllEventsCalendar = async (): Promise<EventInputType[]> => {
  try {
    await handleAuthorization()
    await checkRole(Role.ADMIN)
    const events = await prisma.eventCalendar.findMany({
      orderBy: { start: "asc" },
    })
    return events.map(mapEventDates)
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getChatBotInfoAction = async (botName: string) => {
  const data = await handleAuthorization()
  return await getTelegramChatBotInDb(botName, data.userId)
}

const mapEventDates = (event: EventResponse): EventInputType => ({
  id: event.id,
  title: event.title,
  start: new Date(event.start),
  end: new Date(event.end),
  allDay: event.allDay,
})
