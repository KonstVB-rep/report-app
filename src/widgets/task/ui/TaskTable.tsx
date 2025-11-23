"use client"

import { useCallback, useRef } from "react"
import type { ColumnDef, ColumnFiltersState, Row } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import dynamic from "next/dynamic"
import type { DateRange } from "react-day-picker"
import z from "zod"
import { getManagers } from "@/entities/department/lib/utils"
import type { DepartmentsUnionIds } from "@/entities/department/types"
import { columnsDataTask } from "@/entities/task/model/column-data-tasks"
import type { TaskWithUserInfo } from "@/entities/task/types"
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider"
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext"
import FilterByUsers from "@/feature/filter-persistence/ui/FilterByUsers"
import FilterPopoverGroup from "@/feature/filter-persistence/ui/FilterPopoverGroup"
import { LABEL_TASK_STATUS } from "@/feature/task/model/constants"
import DateRangeFilter from "@/shared/custom-components/ui/DateRangeFilter"
import {
  type TableContextType,
  TableProvider,
} from "@/shared/custom-components/ui/Table/context/TableContext"
import TableRowDealOrTask from "@/shared/custom-components/ui/Table/TableRowDealOrTask"
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate"
import VirtualRow from "@/shared/custom-components/ui/Table/VirtualRow"
import { useTableState } from "@/shared/hooks/useTableState"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import useVirtualizedRowTable from "@/shared/hooks/useVirtualizedRowTable"

const EditTaskDialogContextMenu = dynamic(
  () => import("@/feature/task/ui/Modals/EditTaskDialogContextMenu"),
  {
    ssr: false,
  },
)

const ModalTaskDetails = dynamic(() => import("@/feature/task/ui/Modals/ModalTaskInfo"), {
  ssr: false,
})

const DelTaskDialogContextMenu = dynamic(
  () => import("@/feature/task/ui/Modals/DelTaskDialogContextMenu"),
  {
    ssr: false,
  },
)

interface TaskTableProps<TData extends TaskWithUserInfo> {
  data: TData[]
}

const pageParamsSchema = z.object({
  departmentId: z.coerce
    .number()
    .positive()
    .transform((value) => {
      return value as DepartmentsUnionIds
    }),
})

const TaskTable = <T extends TaskWithUserInfo>({ data }: TaskTableProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null)

  const { departmentId } = useTypedParams(pageParamsSchema)

  const getContextMenuActions: TableContextType<T>["getContextMenuActions"] = useCallback(
    (
      setOpenModal: React.Dispatch<React.SetStateAction<"delete" | "edit" | "more" | null>>,
      row: Row<T>,
    ) => ({
      edit: (
        <EditTaskDialogContextMenu
          close={() => setOpenModal(null)}
          id={row.original.id as string}
        />
      ),
      delete: (
        <DelTaskDialogContextMenu close={() => setOpenModal(null)} id={row.original.id as string} />
      ),
      more: <ModalTaskDetails departmentId={departmentId} taskId={row.original.id as string} />,
    }),
    [departmentId],
  )

  const { table, filtersContextValue } = useTableState(data, columnsDataTask as ColumnDef<T>[])

  const { rows } = table.getRowModel()

  const { columnFilters } = table.getState()

  const { virtualItems, totalSize } = useVirtualizedRowTable<T>({
    rows,
    tableContainerRef,
  })

  if (rows.length === 0) {
    return (
      <div className="py-4">
        <div className="flex items-center justify-center flex-wrap gap-2 p-2 border-b border-t border-border mb-2">
          <h1 className="text-xl text-center w-full uppercase text-muted-foreground">
            Список задач пуст
          </h1>
        </div>
      </div>
    )
  }
  return (
    <DataTableFiltersProvider value={filtersContextValue}>
      <div className="relative grid w-full overflow-hidden rounded-md border bg-background">
        <div className="flex items-center flex-wrap gap-2 p-2 border-b mb-2">
          <div className="flex items-center">
            <FilterByUsers columnId="executorId" label="Исполнитель" managers={getManagers()} />
          </div>
          <FilterTasks columnFilters={columnFilters} />
        </div>
        <div
          className="rounded-lg relative h-full overflow-auto max-h-[78vh] border transition-all duration-200"
          ref={tableContainerRef}
        >
          <TableProvider<T> getContextMenuActions={getContextMenuActions}>
            <TableTemplate className="rounded-md" table={table} totalSize={totalSize}>
              <VirtualRow<T>
                renderRow={({ row, virtualRow }: { row: Row<T>; virtualRow: VirtualItem }) => (
                  <TableRowDealOrTask<T>
                    entityType={"task"}
                    headers={table.getHeaderGroups()[0].headers}
                    key={row.id}
                    row={row}
                    virtualRow={virtualRow}
                  />
                )}
                rows={rows}
                virtualItems={virtualItems}
              />
            </TableTemplate>
          </TableProvider>
        </div>
      </div>
    </DataTableFiltersProvider>
  )
}

export default TaskTable

const FilterTasks = ({ columnFilters }: { columnFilters: ColumnFiltersState }) => {
  const { handleDateChange, handleClearDateFilter } = useDataTableFiltersContext()

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as DateRange | undefined
  return (
    <>
      <FilterPopoverGroup
        options={[
          {
            label: "Статус",
            columnId: "taskStatus",
            options: LABEL_TASK_STATUS,
          },
        ]}
      />
      <DateRangeFilter
        label="Дата"
        onClearDateFilter={handleClearDateFilter}
        onDateChange={handleDateChange("dueDate")}
        value={value}
      />
    </>
  )
}
