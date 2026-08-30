"use client"

import type React from "react"
import { createContext, type ReactNode, useContext, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { type Resolver, type UseFormReturn, useForm } from "react-hook-form"
import { EventCalendarFormSchema, type EventCalendarSchema } from "@/feature/calendar/model/schema"

const defaultValuesForm = {
  eventTitle: "",
  startDateEvent: undefined,
  startTimeEvent: "",
  endDateEvent: undefined,
  endTimeEvent: "",
  allDay: false,
}

interface CalendareContextType {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  confirmDelModal: boolean
  setConfirmDelModal: React.Dispatch<React.SetStateAction<boolean>>
  editingId: string
  setEditingId: React.Dispatch<React.SetStateAction<string>>
  form: UseFormReturn<EventCalendarSchema>
  handleResetAndClose: () => void
  handleCloseModalAfterDeleteEvent: () => void
  closeModalForm: () => void
}

const CalendarContext = createContext<CalendareContextType | undefined>(undefined)

export const useCalendarContext = (): CalendareContextType => {
  const context = useContext(CalendarContext)

  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider")
  }
  return context
}

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [confirmDelModal, setConfirmDelModal] = useState(false)
  const [editingId, setEditingId] = useState("")

  const form = useForm<EventCalendarSchema>({
    resolver: zodResolver(EventCalendarFormSchema) as Resolver<EventCalendarSchema>,
    defaultValues: defaultValuesForm,
  })

  const { reset } = form

  const handleResetAndClose = () => {
    setOpenModal(false)
    setEditingId("")
    reset()
  }

  const handleCloseModalAfterDeleteEvent = () => {
    setConfirmDelModal(false)
    handleResetAndClose()
  }

  const closeModalForm = () => {
    if (openModal) {
      handleResetAndClose()
    } else {
      setOpenModal(true)
    }
  }

  const value = {
    openModal,
    setOpenModal,
    confirmDelModal,
    setConfirmDelModal,
    editingId,
    setEditingId,
    form,
    handleResetAndClose,
    handleCloseModalAfterDeleteEvent,
    closeModalForm,
  }

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}
