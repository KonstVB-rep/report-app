"use client"

import { useEffect } from "react"
import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { columnsDataCalendar } from "@/feature/calendar/model/column-data-calendar"
import type { EventInputType } from "@/feature/calendar/types"
import EventsListTable from "@/feature/calendar/ui/EventsListTable"
import { Button } from "@/shared/components/ui/button"

type EventsListProps = {
  events: EventInputType[]
  showLinkCalendar?: boolean
  handleEventClickOnEventsList?: (eventCalendar: EventInputType) => void
  handleDateSelectOnEventsList: () => void
}

const EventsListDayMobile = ({
  events,
  handleEventClickOnEventsList,
  handleDateSelectOnEventsList,
}: EventsListProps) => {
  const table = useReactTable({
    data: events,
    columns: columnsDataCalendar,
    getCoreRowModel: getCoreRowModel(),
  })

  const { authUser } = useStoreUser()
  const router = useRouter()

  useEffect(() => {
    if (!authUser) {
      router.replace("/login")
    }
  }, [authUser, router])

  if (!authUser) return null

  return (
    <>
      <Button
        aria-label="Добавить событие"
        className="flex items-center justify-start gap-2 w-fit"
        onClick={handleDateSelectOnEventsList}
        variant="outline"
      >
        <Plus size={50} /> <span>Добавить событие</span>
      </Button>

      <div className="rounded-lg overflow-hidden border w-full">
        <EventsListTable handleRowClick={handleEventClickOnEventsList} table={table} />
      </div>
    </>
  )
}

export default EventsListDayMobile
