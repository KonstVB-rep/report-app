"use client"

import { useEffect, useState } from "react"
import { rankItem } from "@tanstack/match-sorter-utils"
import {
  type ColumnDef,
  type FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { CalendarFold } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context"
import useStoreUser from "@/entities/user/store/useStoreUser"
import type { EventInputType } from "@/feature/calendar/types"
import EventsListTable from "@/feature/calendar/ui/EventsListTable"
import ButtonLink from "@/shared/custom-components/ui/Buttons/ButtonLink"
import { columnsDataCalendar } from "../model/column-data-calendar"
import { handleEventClickOnEventsList } from "../utils/eventHandlers"
import CalendarFormModal from "./CalendarFormModal"

type EventsListProps = {
  events: EventInputType[]
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({
    itemRank,
  })

  return itemRank.passed
}

const EventsList = ({ events }: EventsListProps) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data: events,
    columns: columnsDataCalendar as ColumnDef<EventInputType, unknown>[],
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
  })

  const { form, setEditingId, setOpenModal } = useCalendarContext()

  const onEventClick = (eventCalendar: EventInputType) => {
    handleEventClickOnEventsList(eventCalendar, form, setEditingId, setOpenModal)
  }

  const { authUser } = useStoreUser()
  const router = useRouter()

  useEffect(() => {
    if (!authUser) {
      router.replace("/login")
    }
  }, [authUser, router])

  if (!authUser) {
    return null
  }

  return (
    <>
      <div className="grid gap-4">
        <ButtonLink
          icon={<CalendarFold />}
          label="Календарь"
          pathName={`/dashboard/calendar/${authUser.id}`}
        />

        <div className="rounded-lg overflow-hidden border w-full">
          <EventsListTable handleRowClick={onEventClick} table={table} />
        </div>
      </div>
      <CalendarFormModal events={events} />
    </>
  )
}

export default EventsList
