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

const invalidateCalendarQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  userId?: string,
) => {
  if (!userId) return

  queryClient.invalidateQueries({
    queryKey: ["calendar", "all", userId],
  })

  queryClient.invalidateQueries({
    queryKey: ["calendar", "today", userId],
  })

  queryClient.invalidateQueries({
    queryKey: ["calendar", "admin-all", userId],
  })
}

// --- MUTATIONS ---

export const useCreateEventCalendar = (closeModal?: () => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission()

  return useMutation({
    mutationFn: (data: EventDataType) =>
      handleMutationWithAuthCheck<EventDataType, EventResponse>(
        createEventCalendar,
        data,
        authUser,
        isSubmittingRef,
      ),

    onSuccess: () => {
      closeModal?.()

      invalidateCalendarQueries(queryClient, authUser?.id)
      TOAST.SUCCESS("Событие успешно добавлено в календарь")
    },

    onError: (error) => handleCalendarError(error, "Ошибка при добавлении события"),
  })
}

export const useUpdateEventCalendar = (closeModal: () => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission()

  return useMutation({
    mutationFn: (data: EventDataType) =>
      handleMutationWithAuthCheck<EventDataType, EventResponse>(
        updateEventCalendar,
        data,
        authUser,
        isSubmittingRef,
      ),
    onSuccess: () => {
      closeModal()
      invalidateCalendarQueries(queryClient, authUser?.id)
      TOAST.SUCCESS("Событие успешно обновлено")
    },
    onError: (error) => handleCalendarError(error, "Ошибка при обновлении события"),
  })
}

export const useDeleteEventCalendar = (closeModal?: () => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission()

  return useMutation({
    mutationFn: (id: string) =>
      handleMutationWithAuthCheck<{ id: string }, EventResponse>(
        deleteEventCalendar,
        { id },
        authUser,
        isSubmittingRef,
      ),
    onSuccess: () => {
      closeModal?.()
      invalidateCalendarQueries(queryClient, authUser?.id)
      TOAST.SUCCESS("Событие успешно удалено")
    },
    onError: (error) => handleCalendarError(error, "Ошибка при удалении события"),
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
      invalidateCalendarQueries(queryClient, authUser?.id)

      TOAST.SUCCESS("События успешно удалены")
    },
    onError: (error) => handleCalendarError(error, "Ошибка при удалении событий"),
  })
}
