"use client"

import { useCallback, useRef, useState } from "react"
import type { ColumnDef, ColumnFiltersState, Row } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import dynamic from "next/dynamic"
import type { DateRange } from "react-day-picker"
import { getUsers } from "@/entities/department/lib/utils"
import { columnsDataTask } from "@/entities/task/model/column-data-tasks"
import type { TaskWithUserInfo } from "@/entities/task/types"
import TaskTableRow from "@/entities/task/ui/TaskTableRow"
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider"
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext"
import FilterByUsers from "@/feature/filter-persistence/ui/FilterByUsers"
import FilterPopoverGroup from "@/feature/filter-persistence/ui/FilterPopoverGroup"
import { LABEL_TASK_STATUS } from "@/feature/task/model/constants"
import DateRangeFilter from "@/shared/custom-components/ui/DateRangeFilter"
import { EntityActionModal } from "@/shared/custom-components/ui/EntityActionModal"
import {
  type TableContextType,
  TableProvider,
} from "@/shared/custom-components/ui/Table/context/TableContext"
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate"
import VirtualRow from "@/shared/custom-components/ui/Table/VirtualRow"
import { useTableState } from "@/shared/hooks/useTableState"
import useVirtualizedRowTable from "@/shared/hooks/useVirtualizedRowTable"
import type { ModalType } from "@/shared/types"

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

const TaskTable = <T extends TaskWithUserInfo>({ data }: TaskTableProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null)

  const [openedModal, setOpenedModal] = useState<ModalType>(null)

  const [selectedDataItem, setSelectedDataItem] = useState<T | null>(null)

  const getContextMenuActions: TableContextType<T>["getContextMenuActions"] = useCallback(
    (row: Row<T>) => {
      return {
        edit: {
          onClick: () => {
            setSelectedDataItem(row.original)
            setOpenedModal("edit")
          },
        },
        delete: {
          onClick: () => {
            setSelectedDataItem(row.original)
            setOpenedModal("delete")
          },
        },
        more: {
          onClick: () => {
            setSelectedDataItem(row.original)
            setOpenedModal("more")
          },
        },
      }
    },
    [],
  )

  const { table, filtersContextValue } = useTableState(data, columnsDataTask as ColumnDef<T>[])

  const { rows } = table.getRowModel()

  const { columnFilters } = table.getState()

  const { virtualItems, totalSize } = useVirtualizedRowTable<T>({
    rows,
    tableContainerRef,
  })

  if (data.length === 0) {
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
            <FilterByUsers
              columnId="executorId"
              label="Исполнитель"
              managers={getUsers({ onlyManagers: false })}
            />
          </div>
          <FilterTasks columnFilters={columnFilters} />
        </div>
        {rows.length === 0 ? (
          <div className="py-4">
            <div className="flex items-center justify-center flex-wrap gap-2 p-2 border-b border-t border-border mb-2">
              <h1 className="text-xl text-center w-full uppercase text-muted-foreground">
                Список пуст
              </h1>
            </div>
          </div>
        ) : (
          <div
            className="rounded-lg relative h-full overflow-auto max-h-[78vh] border transition-all duration-200"
            ref={tableContainerRef}
          >
            <TableProvider<T>
              getContextMenuActions={getContextMenuActions}
              selectedDataItem={selectedDataItem}
            >
              <TableTemplate className="rounded-md" table={table} totalSize={totalSize}>
                <VirtualRow<T>
                  renderRow={({ row, virtualRow }: { row: Row<T>; virtualRow: VirtualItem }) => (
                    <TaskTableRow
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
              <ActiveModalTask openedModal={openedModal} setOpenedModal={setOpenedModal} />
            </TableProvider>
          </div>
        )}
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

const ActiveModalTask = ({
  openedModal,
  setOpenedModal,
}: {
  openedModal: ModalType
  setOpenedModal: React.Dispatch<React.SetStateAction<ModalType>>
}) => {
  return (
    <EntityActionModal
      openedModal={openedModal}
      renderMap={{
        edit: (close) => <EditTaskDialogContextMenu close={close} />,
        more: () => <ModalTaskDetails />,
        delete: (close) => <DelTaskDialogContextMenu close={close} />,
      }}
      setOpenedModal={setOpenedModal}
    />
  )
}
