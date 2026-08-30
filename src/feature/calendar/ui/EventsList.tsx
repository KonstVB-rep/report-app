"use client"

import { useState } from "react"
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
import { useCalendarContext } from "@/app/dashboard/calendar/context/calendar-context"
import type { EventInputType } from "@/feature/calendar/types"
import EventsListTable from "@/feature/calendar/ui/EventsListTable"
import ButtonLink from "@/shared/custom-components/ui/Buttons/ButtonLink"
import { useRequireAuth } from "@/shared/hooks/useRequireAuth"
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
    // ❌ Убраны debug флаги — не нужны в production
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
  })

  const { form, setEditingId, setOpenModal } = useCalendarContext()
  const authUser = useRequireAuth()

  // ❌ Убран useCallback — React Compiler стабилизирует
  const onEventClick = (eventCalendar: EventInputType) => {
    handleEventClickOnEventsList(eventCalendar, form, setEditingId, setOpenModal)
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
