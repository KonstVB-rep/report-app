import React, { useCallback, useMemo, useState } from "react"
import type { Matcher } from "react-day-picker"
import { useGetEventsCalendarUserToday } from "./query"

const getStartOfDay = (date: Date | string | number) => new Date(date).setHours(0, 0, 0, 0)

const useCalendarMobile = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [openList, setOpenList] = useState(false)

  const { data: events, isPending } = useGetEventsCalendarUserToday()

  const todayTime = useMemo(() => getStartOfDay(new Date()), [])

  const futureEvents = useMemo(() => {
    if (!events) return []
    return events.filter((event) => new Date(event.start).getTime() >= todayTime)
  }, [events, todayTime])

  const eventDates = useMemo<Matcher | Matcher[]>(() => {
    return futureEvents.map((event) => new Date(event.start))
  }, [futureEvents])

  const eventsDate = useMemo(() => {
    if (!selectedDate) return []
    const selectedTime = getStartOfDay(selectedDate)

    return futureEvents.filter((event) => getStartOfDay(event.start) === selectedTime)
  }, [futureEvents, selectedDate])

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return false

      setSelectedDate(date)

      // Проверяем наличие событий эффективнее
      const dateStart = getStartOfDay(date)
      const hasEvents = futureEvents.some((event) => getStartOfDay(event.start) === dateStart)

      if (hasEvents) {
        setOpenList(true)
        return true
      }
      return false
    },
    [futureEvents],
  )

  React.useEffect(() => {
    if (!selectedDate || !openList) return
    if (eventsDate.length === 0) {
      setOpenList(false)
    }
  }, [eventsDate.length, openList, selectedDate])

  return {
    events,
    openList,
    setOpenList,
    eventsDate,
    selectedDate,
    eventDates,
    handleSelect,
    isPending,
  }
}

export default useCalendarMobile
