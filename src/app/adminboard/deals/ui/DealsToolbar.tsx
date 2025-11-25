"use client"

import type { ColumnDef, Table } from "@tanstack/react-table"
import type { DealBase } from "@/entities/deal/types"
import FiltersManagement from "@/feature/filter-persistence/ui/FiltersManagement"
import ButtonExportTableXls from "@/feature/table-export-excel/ui/ButtonExportTableXls"
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput"

const DealsToolbar = ({
  totalCount,
  table,
  columns,
  globalFilter,
  setGlobalFilter,
  openFilters,
}: {
  totalCount: number
  table: Table<DealBase>
  columns: ColumnDef<DealBase>[]
  globalFilter: string
  setGlobalFilter: (v: string) => void
  openFilters: boolean
}) => {
  const originalData = table.getCoreRowModel().rows.map((row) => row.original)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="border rounded-md p-2">Количество заявок: {totalCount}</p>

      <ButtonExportTableXls
        columns={columns}
        isShow={table.getRowModel().rows.length > 0}
        table={table}
      />

      <DebouncedInput
        className="p-2 font-lg shadow border border-block"
        onChange={(v) => setGlobalFilter(String(v))}
        placeholder="Поиск..."
        value={globalFilter}
      />

      <FiltersManagement isShow={originalData.length > 0} openFilters={openFilters} />
    </div>
  )
}

export default DealsToolbar
