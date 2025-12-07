"use client"

import type { RefObject } from "react"
import type { Row, Table } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import type { DealBase } from "@/entities/deal/types"
import { TableCell, TableRow } from "@/shared/components/ui/table"
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate"
import VirtualRow from "@/shared/custom-components/ui/Table/VirtualRow"
import { cn } from "@/shared/lib/utils"
import DealsTableRow from "./DealsTableRow"

type Props = {
  table: Table<DealBase>
  rows: Row<DealBase>[]
  virtualItems: VirtualItem[]
  totalSize: number
  openFullInfoCell: string | null
  setOpenFullInfoCell: (id: string | null) => void
  tableContainerRef: RefObject<HTMLDivElement | null>
  openFilters: boolean
}

const DealsAllTable = ({
  table,
  rows,
  virtualItems,
  totalSize,
  openFullInfoCell,
  setOpenFullInfoCell,
  tableContainerRef,
  openFilters,
}: Props) => {
  const headers = table.getHeaderGroups()[0].headers

  return (
    <div
      className={cn("rounded-lg relative h-full overflow-auto border transition-all duration-200", {
        "max-h-[66vh]": openFilters,
        "max-h-[74vh]": !openFilters,
      })}
      ref={tableContainerRef}
    >
      {table.getRowModel().rows.length > 0 && (
        <p className="border rounded-md px-2 py-1 m-1 w-fit bg-[#3071fc] text-white dark:bg-black">
          Количество выбранных заявок: {table.getRowModel().rows.length}
        </p>
      )}
      <TableTemplate className="rounded-md" table={table} totalSize={totalSize}>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow className="flex items-center justify-center w-full h-full">
            <TableCell>Данные не найдены</TableCell>
          </TableRow>
        ) : (
          <VirtualRow
            renderRow={({ row, virtualRow }) => (
              <DealsTableRow
                headers={headers}
                key={row.id}
                openFullInfoCell={openFullInfoCell}
                row={row}
                setOpenFullInfoCell={setOpenFullInfoCell}
                virtualRow={virtualRow}
              />
            )}
            rows={rows}
            virtualItems={virtualItems}
          />
        )}
      </TableTemplate>
    </div>
  )
}

export default DealsAllTable
