"use client"

import { ru } from "date-fns/locale"
import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context"
import EventsListDayMobile from "@/feature/calendar/ui/EventsListDayMobile"
import { Calendar } from "@/shared/components/ui/calendar"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import useCalendarMobile from "../hooks/useCalendarMobile"
import type { EventInputType } from "../types"
import { handleDateSelectOnEventsList, handleEventClickOnEventsList } from "../utils/eventHandlers"
import CalendarFormModal from "./CalendarFormModal"

const CalendarMobile = () => {
  const {
    events,
    openList,
    setOpenList,
    eventsDate,
    selectedDate,
    eventDates,
    handleSelect,
    isPending,
  } = useCalendarMobile()

  const { form, closeModalForm, setEditingId, setOpenModal } = useCalendarContext()

  const onDateSelect = (date: Date | undefined) => {
    const hasEvents = handleSelect(date)
    if (!hasEvents) {
      handleDateSelectOnEventsList(date, form, setEditingId, closeModalForm)
    }
  }

  const onEventClick = (eventCalendar: EventInputType) => {
    handleEventClickOnEventsList(eventCalendar, form, setEditingId, setOpenModal)
  }

  const onAddEventClick = () => {
    handleDateSelectOnEventsList(selectedDate, form, setEditingId, closeModalForm)
  }

  if (isPending) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="calendar-mobile p-2 xs:p-5">
      <Calendar
        className="rounded-md border shadow"
        disabled={(date) => date < new Date(new Date().toDateString())}
        locale={ru}
        mode="single"
        modifiers={{ highlighted: eventDates }}
        modifiersClassNames={{
          highlighted: "calendar-day-highlighted",
          today: "calendar-day-today",
        }}
        onDayClick={onDateSelect}
        onSelect={onDateSelect}
        selected={selectedDate}
      />

      <DialogComponent
        classNameContent="sm:max-w-[600px] p-2 w-full"
        onOpenChange={setOpenList}
        open={openList}
        trigger={undefined}
      >
        <MotionDivY className="max-h-[82vh] overflow-y-auto flex flex-col gap-2 overflow-x-hidden pt-10">
          <EventsListDayMobile
            events={eventsDate}
            handleDateSelectOnEventsList={onAddEventClick}
            handleEventClickOnEventsList={onEventClick}
          />
        </MotionDivY>
      </DialogComponent>

      <CalendarFormModal events={events} />
    </div>
  )
}

export default CalendarMobile
