"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

export function CalendarMobile({events}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  console.log(events)
  console.log(date)

  const currentEvents =  events.filter(ev => new Date(ev.end) > new Date()).map(item => item.start)

  const handleSetDay = (e) =>{

    console.log(e, 'event')

  }

  console.log(currentEvents,'currentEvents')

  return (
    <Calendar
      mode="multiple"
      selected={currentEvents}
      onSelect={handleSetDay}
      className="rounded-md border shadow"
    />
  )
}
