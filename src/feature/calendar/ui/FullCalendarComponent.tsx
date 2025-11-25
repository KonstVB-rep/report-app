"use client"

import { useState } from "react"
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core"
import ruLocale from "@fullcalendar/core/locales/ru"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { useRouter, useSearchParams } from "next/navigation"
import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context"
import { useEventActionContext } from "@/app/dashboard/calendar/context/events-action-provider"
import { handleDateSelect, handleEventClick } from "@/feature/calendar/utils/eventHandlers"

const defaultView = "dayGridMonth"

const FullCalendarComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { events } = useEventActionContext()
  const { form, setEditingId, setOpenModal } = useCalendarContext()

  const viewFromUrl = searchParams.get("view")
  const [currentView, setCurrentView] = useState(viewFromUrl || defaultView)

  const handleDatesSet = (arg: { view: { type: string } }) => {
    const titleEl = document.querySelector(".fc-toolbar-title")
    titleEl?.classList.add("title-calendar")

    const newView = arg.view.type
    setCurrentView(newView)

    const params = new URLSearchParams(window.location.search)
    params.set("view", newView)
    const newUrl = `${window.location.pathname}?${params.toString()}`

    if (window.location.search !== `?${params.toString()}`) {
      router.replace(newUrl, { scroll: false })
    }
  }

  const handleEventClickFn = (clickInfo: EventClickArg) =>
    handleEventClick(clickInfo, form, setEditingId, setOpenModal)

  const handleDateSelectFn = (event: DateSelectArg) => {
    setEditingId("")
    handleDateSelect(event, form, setOpenModal)
  }

  return (
    <div className="full-calendar">
      <FullCalendar
        contentHeight="auto"
        datesSet={handleDatesSet}
        dayCellClassNames={(arg) => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (arg.date < today) return ["fc-day-disabled"]
          return []
        }}
        dayMaxEvents={2}
        eventClick={handleEventClickFn}
        events={events ?? []}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        handleWindowResize={false}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        initialView={currentView}
        locale={ruLocale}
        locales={[ruLocale]}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        select={handleDateSelectFn}
        selectAllow={(selectInfo) => {
          const now = new Date()
          now.setHours(0, 0, 0, 0)
          return selectInfo.start >= now
        }}
        selectable={true}
        selectMirror={false}
        slotDuration="00:30:00"
        slotEventOverlap={false}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        slotLabelInterval="00:30:00"
        slotMaxTime="24:00:00"
        slotMinTime="00:00:00"
        titleFormat={{
          day: "numeric",
          month: "long",
          year: "numeric",
        }}
        unselectAuto={true}
      />
    </div>
  )
}

export default FullCalendarComponent
