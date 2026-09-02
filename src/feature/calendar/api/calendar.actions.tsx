"use server"

import { Prisma, Role } from "@prisma/client"
import { requireUser } from "@/app/api/utils/requireAuth"
import { prisma } from "@/prisma/prisma-client"
import { getTelegramChatBotInDb } from "@/shared/api/getTelegramChatBotInDb"
import { handleError } from "@/shared/api/handleError"
import type { EventDataType, EventInputType, EventResponse, EventResponseShort } from "../types"

export const createEventCalendar = async (eventData: Omit<EventDataType, "id">) => {
  try {
    const user = await requireUser()

    const { userId } = user
    const { title, start, end, allDay = false } = eventData
    const newEvent = await prisma.eventCalendar.create({
      data: {
        title,
        start: new Date(start),
        end: end ? new Date(end) : new Date(start),
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

export const updateEventCalendar = async (eventData: EventDataType): Promise<EventResponse> => {
  try {
    const user = await requireUser()
    const { userId } = user
    const { id, title, start, end, allDay = false } = eventData

    const updatedEvent = await prisma.eventCalendar.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        title,
        start: new Date(start),
        end: end ? new Date(end) : new Date(start),
        allDay,
        notified: false,
      },
    })

    return updatedEvent as unknown as EventResponse
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("Событие не найдено или у вас нет прав на его изменение")
      }
    }

    // Если это какая-то другая ошибка (сеть, база данных и т.д.)
    console.error("Original error:", error)
    throw new Error("Не удалось обновить событие")
  }
}
export const deleteEventCalendar = async (eventData: { id: string }) => {
  try {
    const { userId, role } = await requireUser()

    const event = await prisma.eventCalendar.findUnique({
      where: {
        id: eventData.id,
      },
    })

    const isOwer = event?.userId === userId

    const isAdmin = role === Role.ADMIN
    if (!isOwer && !isAdmin) {
      throw new Error("Недостаточно прав")
    }

    await prisma.eventCalendar.delete({
      where: {
        id: eventData.id,
        userId,
      },
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        handleError("Событие не найдено или у вас нет прав на его удаление")
      }
    }
    return handleError((error as Error).message)
  }
}

export const deleteArrayEventsCalendar = async (eventData: {
  selectedIds: string[]
  selectedUserIds: string[]
}) => {
  try {
    const user = await requireUser()
    const { selectedIds, selectedUserIds } = eventData

    if (user.role !== Role.ADMIN) {
      throw new Error("Недостаточно прав")
    }

    const result = await prisma.eventCalendar.deleteMany({
      where: {
        id: { in: selectedIds },
        userId: { in: selectedUserIds },
      },
    })

    if (result.count !== selectedIds.length) {
      throw new Error("Некоторые события не найдены или нет прав на удаление")
    }

    return { success: true, count: result.count }
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}
export const getEventsCalendarUser = async (): Promise<EventInputType[]> => {
  try {
    const user = await requireUser()
    const events = await prisma.eventCalendar.findMany({
      where: { userId: user.userId },
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
    const user = await requireUser()
    const events = await prisma.eventCalendar.findMany({
      where: {
        userId: user.userId,
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
export const getAllEventsCalendar = async (): Promise<EventResponseShort[]> => {
  try {
    const user = await requireUser()

    if (user.role !== Role.ADMIN) {
      throw new Error("Недостаточно прав")
    }

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
  const { userId } = await requireUser()

  return await getTelegramChatBotInDb(botName, userId)
}

const mapEventDates = (event: EventResponse): EventResponseShort => ({
  id: event.id,
  userId: event.userId || "",
  title: event.title,
  start: new Date(event.start),
  end: new Date(event.end),
  allDay: event.allDay,
})
