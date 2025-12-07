import type { Prisma } from "@prisma/client"
import { useMutation, type useQueryClient } from "@tanstack/react-query"
import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck"
import { logout } from "@/shared/auth/logout"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import {
  createEventCalendar,
  deleteArrayEventsCalendar,
  deleteEventCalendar,
  updateEventCalendar,
} from "../api"
import type { EventDataType, EventResponse } from "../types"

// --- HELPERS (Вспомогательные функции) ---

// ОПТИМИЗАЦИЯ: Вынесли обработку ошибок в отдельную функцию (DRY - Don't Repeat Yourself).
// Раньше этот блок кода дублировался 4 раза.
const handleCalendarError = (error: unknown, defaultMessage: string) => {
  const err = error as Error & { status?: number }

  if (err.status === 401 || err.message === "Сессия истекла") {
    TOAST.ERROR("Сессия истекла. Пожалуйста, войдите снова.")
    logout()
    return
  }

  const errorMessage = err.message === "Failed to fetch" ? "Ошибка соединения" : defaultMessage

  TOAST.ERROR(errorMessage)
}

// ИСПРАВЛЕНИЕ: Функция для обновления кэша с учетом ваших НОВЫХ ключей запросов.
const invalidateCalendarQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  userId?: string,
) => {
  if (!userId) return

  // 1. ИСПРАВЛЕНИЕ: Обновляем ключ ["calendar", "all"], который используется в useGetEventsCalendarUser
  queryClient.invalidateQueries({
    queryKey: ["calendar", "all", userId],
  })

  // 2. ИСПРАВЛЕНИЕ: Обновляем ключ ["calendar", "today"].
  // React Query автоматически найдет и обновит ключ ["calendar", "today", userId, "2023-12-07T..."]
  // (Fuzzy matching: совпадение по началу массива).
  queryClient.invalidateQueries({
    queryKey: ["calendar", "today", userId],
  })

  // 3. ДОБАВЛЕНИЕ: Обновляем админский список ["calendar", "admin-all"], который используется в useGetAllEvents.
  // Раньше этот ключ обновлялся только в useDeleteEventsCalendar, теперь везде для согласованности.
  queryClient.invalidateQueries({
    queryKey: ["calendar", "admin-all", userId],
  })
}

// --- MUTATIONS ---

export const useCreateEventCalendar = (closeModal: () => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission()

  return useMutation({
    // ИСПРАВЛЕНИЕ: Переименовали аргумент (EventDataType -> data), чтобы имя переменной не совпадало с именем типа.
    mutationFn: (data: EventDataType) =>
      handleMutationWithAuthCheck<EventDataType, EventResponse>(
        createEventCalendar,
        data, // <-- передаем data
        authUser,
        isSubmittingRef,
      ),
    onSuccess: () => {
      closeModal()
      // ОПТИМИЗАЦИЯ: Вызов единой функции инвалидации вместо ручного перечисления ключей.
      invalidateCalendarQueries(queryClient, authUser?.id)
      TOAST.SUCCESS("Событие успешно добавлено в календарь")
    },
    // ОПТИМИЗАЦИЯ: Использование общего обработчика ошибок.
    onError: (error) => handleCalendarError(error, "Ошибка при добавлении события"),
  })
}

export const useUpdateEventCalendar = (closeModal: () => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission()

  return useMutation({
    mutationFn: (
      data: EventDataType, // <-- исправлено имя переменной
    ) =>
      handleMutationWithAuthCheck<EventDataType, EventResponse>(
        updateEventCalendar,
        data,
        authUser,
        isSubmittingRef,
      ),
    onSuccess: () => {
      closeModal()
      invalidateCalendarQueries(queryClient, authUser?.id) // <-- единая функция
      TOAST.SUCCESS("Событие успешно обновлено")
    },
    onError: (error) => handleCalendarError(error, "Ошибка при обновлении события"), // <-- общий обработчик
  })
}

export const useDeleteEventCalendar = (closeModal?: () => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission()

  return useMutation({
    // ОПТИМИЗАЦИЯ: Убрали async/await, так как возвращаем Promise напрямую из handleMutationWithAuthCheck.
    mutationFn: (id: string) =>
      handleMutationWithAuthCheck<{ id: string }, EventResponse>(
        deleteEventCalendar,
        { id },
        authUser,
        isSubmittingRef,
      ),
    onSuccess: () => {
      closeModal?.()
      invalidateCalendarQueries(queryClient, authUser?.id) // <-- единая функция
      TOAST.SUCCESS("Событие успешно удалено")
    },
    onError: (error) => handleCalendarError(error, "Ошибка при удалении события"), // <-- общий обработчик
  })
}

export const useDeleteEventsCalendar = (closeModal?: () => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission()

  return useMutation({
    mutationFn: (ids: string[]) =>
      handleMutationWithAuthCheck<{ ids: string[] }, Prisma.BatchPayload>(
        deleteArrayEventsCalendar,
        { ids },
        authUser,
        isSubmittingRef,
      ),
    onSuccess: () => {
      closeModal?.()
      // ИСПРАВЛЕНИЕ ЛОГИКИ: В оригинале тут обновлялся только ["allEvents"].
      // Теперь мы обновляем ВСЕ списки (и "сегодня", и "все").
      // Если удалить событие пачкой, оно должно исчезнуть и из "сегодняшнего" виджета тоже.
      invalidateCalendarQueries(queryClient, authUser?.id)

      TOAST.SUCCESS("События успешно удалены")
    },
    onError: (error) => handleCalendarError(error, "Ошибка при удалении событий"),
  })
}
