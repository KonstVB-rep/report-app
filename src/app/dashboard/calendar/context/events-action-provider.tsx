"use client"

import { createContext, type ReactNode, useContext, useMemo } from "react"
import {
  useCreateEventCalendar,
  useDeleteEventCalendar,
  useUpdateEventCalendar,
} from "@/feature/calendar/hooks/mutate"
import { useGetEventsCalendarUser } from "@/feature/calendar/hooks/query"
import type { EventDataType, EventInputType } from "@/feature/calendar/types"
import { useCalendarContext } from "./calendar-context"

interface EventsActionContextType {
  isLoading: boolean
  events: EventInputType[] | undefined
  createEvent: (event: Omit<EventDataType, "id">) => void
  updateEvent: (event: EventDataType) => void
  deleteEvent: (id: string) => void
  isPendingLoad: boolean
  isPendingDelete: boolean
}

const EventActionContext = createContext<EventsActionContextType | undefined>(undefined)

export const useEventActionContext = (): EventsActionContextType => {
  const context = useContext(EventActionContext)
  if (!context) {
    throw new Error("useEventActionContext must be used within EventsActionProvider")
  }
  return context
}

export const EventsActionProvider = ({ children }: { children: ReactNode }) => {
  const { handleResetAndClose, handleCloseModalAfterDeleteEvent } = useCalendarContext()

  const { data: events, isPending: isPendingLoad } = useGetEventsCalendarUser()
  const { mutate: createEvent, isPending } = useCreateEventCalendar(handleResetAndClose)

  const { mutate: updateEvent, isPending: isPendingUpdate } =
    useUpdateEventCalendar(handleResetAndClose)

  const { mutate: deleteEvent, isPending: isPendingDelete } = useDeleteEventCalendar(
    handleCloseModalAfterDeleteEvent,
  )

  const isLoading = isPendingUpdate || isPending || isPendingDelete

  const value = useMemo(
    () => ({
      isLoading,
      events,
      createEvent,
      updateEvent,
      deleteEvent,
      isPendingLoad,
      isPendingDelete,
    }),
    [isLoading, events, createEvent, updateEvent, deleteEvent, isPendingLoad, isPendingDelete],
  )

  return <EventActionContext.Provider value={value}>{children}</EventActionContext.Provider>
}
