"use client"

import type { ReactNode } from "react"
import type { ColumnDef, Table } from "@tanstack/react-table"
import dynamic from "next/dynamic"
import type { TableType } from "@/entities/deal/types"
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider"
import FiltersManagement from "@/feature/filter-persistence/ui/FiltersManagement"
import ButtonExportTableXls from "@/feature/table-export-excel/ui/ButtonExportTableXls"
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
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
  rowData: (props: {
    table: Table<T>
    openFilters: boolean
    hasEditDeleteActions: boolean
  }) => ReactNode
  dealType: TableType
  hiddenColumns?: Partial<Record<Extract<NonNullable<ColumnDef<T>["id"]>, string>, boolean>>
}

const DataTable = <T extends { id: string }>({
  columns,
  data,
  hasEditDeleteActions = true,
  children,
  rowData,
  dealType,
  hiddenColumns,
}: DataTableProps<T>) => {
  const { table, filtersContextValue, openFilters, setGlobalFilter, globalFilter } = useTableState(
    data,
    columns,
    { hiddenColumns },
  )

  const currentData = table.getRowModel().rows.map((row) => row.original)
  const originalData = table.getCoreRowModel().rows.map((row) => row.original)

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
              value={globalFilter}
            />
          </div>

          <FiltersManagement isShow={originalData.length > 0} openFilters={openFilters} />

          {children}
        </div>

        <div
          className={`grid overflow-hidden transition-all duration-200 ${openFilters ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"}`}
        >
          {openFilters && (
            <FiltersBlock dealType={dealType} table={table as Table<Record<string, unknown>>} />
          )}
        </div>

        {data.length > 0 ? (
          rowData({ table, openFilters, hasEditDeleteActions })
        ) : (
          <h1 className="my-2 rounded-md bg-muted px-4 py-2 text-center text-xl">Нет данных</h1>
        )}
      </div>
    </DataTableFiltersProvider>
  )
}

export default DataTable
