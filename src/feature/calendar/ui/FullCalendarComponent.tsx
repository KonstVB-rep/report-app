"use client"

import { useCallback, useMemo, useState } from "react"
import type { DateSelectArg, DatesSetArg, EventClickArg, FormatterInput } from "@fullcalendar/core"
import ruLocale from "@fullcalendar/core/locales/ru"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context"
import { useEventActionContext } from "@/app/dashboard/calendar/context/events-action-provider"
import { handleDateSelect, handleEventClick } from "@/feature/calendar/utils/eventHandlers"

const DEFAULT_VIEW = "dayGridMonth"

const PLUGINS = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]

const HEADER_TOOLBAR = {
  left: "prev,next",
  center: "title",
  right: "dayGridMonth,timeGridWeek,timeGridDay",
}
const LOCALES = [ruLocale]
const TIME_FORMAT: FormatterInput | FormatterInput[] | undefined = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}

const TITLE_TIME_FORMAT: FormatterInput | undefined = {
  day: "numeric",
  month: "long",
  year: "numeric",
}

const FullCalendarComponent = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { events } = useEventActionContext()
  const { form, setEditingId, setOpenModal } = useCalendarContext()

  const [currentView, setCurrentView] = useState(searchParams.get("view") || DEFAULT_VIEW)

  const todayStart = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const handleDatesSet = useCallback(
    (arg: DatesSetArg) => {
      const newView = arg.view.type

      if (newView !== currentView) {
        setCurrentView(newView)
      }

      const currentParams = new URLSearchParams(searchParams.toString())
      if (currentParams.get("view") !== newView) {
        currentParams.set("view", newView)
        router.replace(`${pathname}?${currentParams.toString()}`, {
          scroll: false,
        })
      }
    },
    [currentView, pathname, router, searchParams],
  )

  const handleEventClickFn = useCallback(
    (clickInfo: EventClickArg) => {
      handleEventClick(clickInfo, form, setEditingId, setOpenModal)
    },
    [form, setEditingId, setOpenModal],
  )

  const handleDateSelectFn = useCallback(
    (event: DateSelectArg) => {
      setEditingId("")
      handleDateSelect(event, form, setOpenModal)
    },
    [form, setEditingId, setOpenModal],
  )

  const dayCellClassNames = useCallback(
    (arg: { date: Date }) => {
      return arg.date < todayStart ? ["fc-day-disabled"] : []
    },
    [todayStart],
  )

  const selectAllow = useCallback(
    (selectInfo: { start: Date }) => {
      return selectInfo.start >= todayStart
    },
    [todayStart],
  )

  return (
    <div className="full-calendar">
      <FullCalendar
        contentHeight="auto"
        datesSet={handleDatesSet}
        dayCellClassNames={dayCellClassNames}
        dayMaxEvents={2}
        eventClick={handleEventClickFn}
        events={events ?? []}
        eventTimeFormat={TIME_FORMAT}
        handleWindowResize={true}
        headerToolbar={HEADER_TOOLBAR}
        height="auto"
        initialView={currentView}
        locale={ruLocale}
        locales={LOCALES}
        plugins={PLUGINS}
        select={handleDateSelectFn}
        selectAllow={selectAllow}
        selectable={true}
        selectMirror={false}
        slotDuration="00:30:00"
        slotEventOverlap={false}
        slotLabelFormat={TIME_FORMAT}
        slotLabelInterval="00:30:00"
        slotMaxTime="24:00:00"
        slotMinTime="00:00:00"
        titleFormat={TITLE_TIME_FORMAT}
        unselectAuto={true}
      />
    </div>
  )
}

export default FullCalendarComponent
