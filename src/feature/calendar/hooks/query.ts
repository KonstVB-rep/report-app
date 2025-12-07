import { useQuery } from "@tanstack/react-query"
import { endOfDay, startOfDay } from "date-fns"
import useStoreUser, { userIdSelector } from "@/entities/user/store/useStoreUser"
import {
  getAllEventsCalendar,
  getChatBotInfoAction,
  getEventsCalendarUser,
  getEventsCalendarUserRange,
} from "../api"

const STALE_TIME_LONG = 5 * 60 * 1000
const STALE_TIME_SHORT = 1 * 60 * 1000

// --- ХУКИ ---

export const useGetEventsCalendarUser = () => {
  const userId = useStoreUser(userIdSelector)

  return useQuery({
    queryKey: ["calendar", "all", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Пользователь не авторизован")
      return await getEventsCalendarUser()
    },
    enabled: !!userId,
    staleTime: STALE_TIME_LONG,
  })
}

export const useGetEventsCalendarUserToday = () => {
  const userId = useStoreUser(userIdSelector)

  const todayStart = startOfDay(new Date())
  const todayEnd = endOfDay(new Date())

  return useQuery({
    // Добавляем ISO строку в ключ. Если наступит полночь, дата сменится -> запрос уйдет новый.
    queryKey: ["calendar", "today", userId, todayStart.toISOString()],
    queryFn: async () => {
      return await getEventsCalendarUserRange(todayStart, todayEnd)
    },
    enabled: !!userId,
    staleTime: STALE_TIME_SHORT,
    refetchOnWindowFocus: true,
  })
}

export const useGetAllEvents = () => {
  const userId = useStoreUser(userIdSelector)

  return useQuery({
    queryKey: ["calendar", "admin-all", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Auth required")
      return await getAllEventsCalendar()
    },
    enabled: !!userId,
    staleTime: STALE_TIME_LONG,
  })
}

// --- ХУК БОТА (SOFT FAIL PATTERN) ---

export const useGetInfoChat = (botName: string) => {
  const userId = useStoreUser(userIdSelector)

  const fallbackBotInfo = {
    id: null,
    botName,
    isActive: false,
    chatId: "",
    chatName: "",
    description: "",
  }

  return useQuery({
    queryKey: ["chatInfo", userId, botName],
    queryFn: async () => {
      if (!userId || !botName) return fallbackBotInfo

      try {
        const result = await getChatBotInfoAction(botName)
        return result || fallbackBotInfo
      } catch (error) {
        console.error("Error fetching bot info:", error)
        return fallbackBotInfo
      }
    },
    enabled: !!userId && !!botName,
    staleTime: STALE_TIME_LONG,
    placeholderData: fallbackBotInfo,
  })
}
