import axios from "axios"
import { NextResponse } from "next/server"
import {
  getEventsCalendarUserTodayRoute,
  getInfoChatNotificationChecked,
} from "@/feature/calendar/api/server"
import type { Chat, EventInputType } from "@/feature/calendar/types"
import { prisma } from "@/prisma/prisma-client"

type DealItem = {
  id: string
  email: string | null
  phone: string | null
  nameDeal: string
  contact: string
  plannedDateConnection: Date | null
}

type LogItem = {
  type: "calendar" | "project" | "retail"
  chatId: string
  itemName: string
  status: "sent" | "skipped"
  reason?: string
}

const CACHE_TTL = {
  CALENDAR: 2, // минуты
  DAILY: 1440, // минуты (24 часа)
}

// --- отправка уведомлений ---
async function sendNotificationsToTelegram(events: (EventInputType & { chatId: string })[]) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/telegram/notify`,
    events,
    { headers: { "Content-Type": "application/json" } },
  )
  return response.data.message
}

// --- кеш ---
async function getCache(key: string) {
  const now = new Date()
  await prisma.notificationCache.deleteMany({ where: { expiresAt: { lt: now } } })
  const cache = await prisma.notificationCache.findUnique({ where: { key } })
  return cache ? cache.value : null
}

async function setCache(key: string, value: string, ttlMinutes = CACHE_TTL.CALENDAR) {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)
  await prisma.notificationCache.upsert({
    where: { key },
    update: { value, expiresAt },
    create: { key, value, expiresAt },
  })
}

function isInactiveChat(chat: Chat): boolean {
  return !chat.isActive || !chat.chatId || !chat.userId
}

async function sendDailyNotifications(
  chatId: string,
  items: DealItem[],
  type: "project" | "retail",
  logs: LogItem[],
) {
  for (const item of items) {
    if (!item.plannedDateConnection) continue

    const itemCacheKey = `chat_${chatId}_${type}_${item.id}`
    const lastItemSent = await getCache(itemCacheKey)
    const itemDate = item.plannedDateConnection.toISOString().slice(0, 10)

    if (lastItemSent === itemDate) {
      logs.push({
        type,
        chatId,
        itemName: item.nameDeal,
        status: "skipped",
        reason: "already sent today",
      })
      continue
    }

    const notification = {
      chatId: String(chatId),
      title: [
        `Сегодня плановая дата контакта по сделке: ${item.nameDeal}`,
        item.contact && `Контакт: ${item.contact}`,
        item.phone && `Телефон: ${item.phone}`,
        item.email && `Email: ${item.email}`,
      ]
        .filter(Boolean)
        .join("\n"),
      start: item.plannedDateConnection,
    }

    try {
      await sendNotificationsToTelegram([notification])
      await setCache(itemCacheKey, itemDate, CACHE_TTL.DAILY)
      logs.push({ type, chatId, itemName: item.nameDeal, status: "sent" })
      console.log(`✅ Уведомление отправлено [${type}] для чата ${chatId}: ${item.nameDeal}`)
    } catch (error: unknown) {
      const reason = error instanceof Error ? error.message : "send error"
      logs.push({ type, chatId, itemName: item.nameDeal, status: "skipped", reason })
      console.error(`❌ Ошибка отправки [${type}] для чата ${chatId}: ${item.nameDeal}`, reason)
    }
  }
}

export async function GET() {
  const logs: LogItem[] = []

  try {
    const allChats = await getInfoChatNotificationChecked()
    if (!allChats.length) return NextResponse.json({ message: "Нет активных чатов" })

    const now = new Date()
    now.setSeconds(0, 0)

    // ===== Календарные события =====
    for (const chat of allChats) {
      if (isInactiveChat(chat)) continue

      const events = await getEventsCalendarUserTodayRoute(chat.userId)
      if (!events?.length) continue

      const upcomingEvents = events.filter((event) => {
        const eventTime = new Date(event.start).getTime()
        const nowTime = now.getTime()
        const windows = [
          { start: eventTime - 31 * 60_000, end: eventTime - 29 * 60_000 },
          { start: eventTime - 16 * 60_000, end: eventTime - 14 * 60_000 },
          { start: eventTime - 1 * 60_000, end: eventTime + 1 * 60_000 },
        ]
        return windows.some((w) => nowTime >= w.start && nowTime <= w.end) && nowTime <= eventTime
      })

      if (!upcomingEvents.length) continue

      for (const event of upcomingEvents) {
        const eventCacheKey = `chat_${chat.chatId}_event_${event.id}`
        const lastSent = await getCache(eventCacheKey)
        const nowTime = Date.now()
        const notification = { ...event, chatId: String(chat.chatId) }

        if (!lastSent || parseInt(lastSent, 10) < nowTime - 3 * 60_000) {
          try {
            await sendNotificationsToTelegram([notification])
            await setCache(eventCacheKey, Date.now().toString())
            logs.push({
              type: "calendar",
              chatId: chat.chatId,
              itemName: event.title,
              status: "sent",
            })
            console.log(`🔔 Календарь отправлен для чата ${chat.chatId}: ${event.title}`)
          } catch (error: unknown) {
            const reason = error instanceof Error ? error.message : "send error"
            logs.push({
              type: "calendar",
              chatId: chat.chatId,
              itemName: event.title,
              status: "skipped",
              reason,
            })
            console.error(
              `❌ Ошибка отправки календаря для чата ${chat.chatId}: ${event.title}`,
              reason,
            )
          }
        } else {
          logs.push({
            type: "calendar",
            chatId: chat.chatId,
            itemName: event.title,
            status: "skipped",
            reason: "already sent in window",
          })
        }
      }
    }

    // ===== Уведомления =====
    const moscowNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }))
    if (moscowNow.getHours() === 9 && moscowNow.getMinutes() <= 30) {
      const start = new Date(moscowNow.setHours(0, 0, 0, 0))
      const end = new Date(moscowNow.setHours(23, 59, 59, 999))

      const activeChats = allChats.filter((c) => c.isActive && c.chatId && c.userId)
      const userIds = activeChats.map((c) => c.userId)

      if (userIds.length > 0) {
        const [allProjects, allRetails] = await Promise.all([
          prisma.project.findMany({
            where: {
              userId: { in: userIds },
              plannedDateConnection: { not: null, gte: start, lte: end },
            },
            select: {
              id: true,
              nameDeal: true,
              contact: true,
              phone: true,
              email: true,
              plannedDateConnection: true,
              userId: true,
            },
          }),
          prisma.retail.findMany({
            where: {
              userId: { in: userIds },
              plannedDateConnection: { not: null, gte: start, lte: end },
            },
            select: {
              id: true,
              nameDeal: true,
              contact: true,
              phone: true,
              email: true,
              plannedDateConnection: true,
              userId: true,
            },
          }),
        ])

        // --- создаём Map по userId для быстрого доступа ---
        const projectsMap = new Map<string, DealItem[]>()
        for (const p of allProjects) {
          const arr = projectsMap.get(p.userId) ?? []
          arr.push(p)
          projectsMap.set(p.userId, arr)
        }

        const retailsMap = new Map<string, DealItem[]>()
        for (const r of allRetails) {
          const arr = retailsMap.get(r.userId) ?? []
          arr.push(r)
          retailsMap.set(r.userId, arr)
        }

        for (const chat of activeChats) {
          const projects = projectsMap.get(chat.userId) || []
          const retails = retailsMap.get(chat.userId) || []

          await sendDailyNotifications(String(chat.chatId), projects, "project", logs)
          await sendDailyNotifications(String(chat.chatId), retails, "retail", logs)
        }
      }
    }

    console.log("📊 Логи отправки уведомлений:", JSON.stringify(logs, null, 2))
    return NextResponse.json({ message: "Проверка завершена", logs })
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "unknown error"
    console.error("❌ Ошибка в check-and-notify:", reason)
    return NextResponse.json(
      { message: "Ошибка при проверке уведомлений", reason },
      { status: 500 },
    )
  }
}
