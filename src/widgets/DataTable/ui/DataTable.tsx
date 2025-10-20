"use client"

import type { ColumnDef, Table } from "@tanstack/react-table"
import dynamic from "next/dynamic"
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider"
import FiltersManagement from "@/feature/filter-persistence/ui/FiltersManagement"
import ButtonExportTableXls from "@/feature/table-export-excel/ui/ButtonExportTableXls"
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import TableComponentDT from "@/shared/custom-components/ui/Table/TableComponentDT"
import { useTableState } from "@/shared/hooks/useTableState"

const FiltersBlock = dynamic(() => import("./Filters/FiltersBlock"), {
  ssr: false,
  loading: () => <LoaderCircle />,
})

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  hasEditDeleteActions?: boolean
  children?: React.ReactNode
}

const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  hasEditDeleteActions = true,
  children,
}: DataTableProps<T>) => {
  const { table, filtersContextValue, openFilters, setGlobalFilter } = useTableState(
    data,
    columns,
    { resource: false },
  )

  const { globalFilter } = table.getState()

  const currentData = table.getRowModel().rows.map((row) => row.original) // Получаем текущие данные (с учётом всех применённых фильтров/сортировок)

  const originalData = table.getCoreRowModel().rows.map((row) => row.original) // Получаем исходные данные (без фильтров/сортировок)

  return (
    <DataTableFiltersProvider value={filtersContextValue}>
      <div className="relative grid w-full overflow-auto rounded-lg border bg-background pt-2 px-2 auto-rows-max pb-2">
        <div className="flex items-center justify-between gap-2 pb-2">
          <ButtonExportTableXls columns={columns} isShow={currentData.length > 0} table={table} />

          <div>
            <DebouncedInput
              className="p-2 font-lg shadow border border-block"
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Поиск..."
              value={globalFilter ?? ""}
            />
          </div>

          <FiltersManagement isShow={originalData.length > 0} openFilters={openFilters} />

          {children}
        </div>
        <div
          className={`grid overflow-hidden transition-all duration-200 ${openFilters ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"}`}
        >
          {openFilters && <FiltersBlock table={table as Table<Record<string, unknown>>} />}
        </div>

        {data.length > 0 ? (
          <TableComponentDT
            hasEditDeleteActions={hasEditDeleteActions}
            openFilters={openFilters}
            table={table}
          />
        ) : (
          <h1 className="my-2 rounded-md bg-muted px-4 py-2 text-center text-xl">Нет данных</h1>
        )}
      </div>
    </DataTableFiltersProvider>
  )
}

export default DataTable
