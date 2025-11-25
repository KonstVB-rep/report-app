"use client"

import { useRef } from "react"
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider"
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput"
import DeleteDialog from "@/shared/custom-components/ui/DeleteDIalog"
import { TitlePageBlock } from "@/shared/custom-components/ui/TitlePage"
import { useTableState } from "@/shared/hooks/useTableState"
import useVirtualizedRowTable from "@/shared/hooks/useVirtualizedRowTable"
import { useDeleteEventsCalendar } from "../../hooks/mutate"
import { useGetAllEvents } from "../../hooks/query"
import type { EventInputType } from "../../types"
import EventsTableContent from "./EventsTableContent"
import { columnsDataEvents } from "./model/column-data-events"

const EventsTable = () => {
  const { data, isLoading } = useGetAllEvents()
  const events = data || []
  const tableContainerRef = useRef<HTMLDivElement | null>(null)

  const { mutate, isPending } = useDeleteEventsCalendar()

  const { table, filtersContextValue, setGlobalFilter } = useTableState<EventInputType>(
    events,
    columnsDataEvents,
  )

  const { rows } = table.getRowModel()

  const { virtualItems, totalSize } = useVirtualizedRowTable<EventInputType>({
    rows,
    tableContainerRef,
  })

  const { globalFilter } = table.getState()

  const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id)

  const selectedTitles = table.getSelectedRowModel().rows.map((row) => row.original)

  return (
    <>
      <TitlePageBlock
        infoText="Здесь вы можете удалять прошедшие события"
        subTitle={`Количество событий: ${events.length}`}
        title="Список событий календаря"
      />

      <DataTableFiltersProvider value={filtersContextValue}>
        <div className="py-2 grid gap-2" ref={tableContainerRef}>
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center justify-between gap-1 flex-wrap w-full">
              <DebouncedInput
                className="p-2 font-lg shadow border border-block"
                onChange={(value) => setGlobalFilter(String(value))}
                placeholder="Поиск..."
                value={globalFilter ?? ""}
              />
              {selectedIds.length > 0 && (
                <DeleteDialog
                  description="Вы действительно хотите удалить события?"
                  isPending={isPending}
                  mutate={() => mutate(selectedIds as string[])}
                  title="Удалить события"
                >
                  <div className="text-center">Вы уверены что хотите удалить события?</div>
                  <div className="grid text-center">
                    <span> События: </span>
                    <div className="max-h-[50vh] overflow-y-auto">
                      {selectedTitles.map((row) => (
                        <span className="text-lg font-bold capitalize" key={row.id}>
                          {row.title}
                        </span>
                      ))}
                    </div>
                    <span>будeт удалены безвозвратно</span>
                  </div>
                </DeleteDialog>
              )}
            </div>
          </div>
          <EventsTableContent
            isLoading={isLoading}
            rows={rows}
            table={table}
            totalSize={totalSize}
            virtualItems={virtualItems}
          />
        </div>
      </DataTableFiltersProvider>
    </>
  )
}

export default EventsTable
