import { useRef } from "react"
import type { Row, Table } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import useVirtualizedRowTable from "@/shared/hooks/useVirtualizedRowTable"
import { cn } from "@/shared/lib/utils"
import TableTemplate from "./TableTemplate"
import VirtualRow from "./VirtualRow"

// Убираем жесткое ограничение Record<string, unknown>, используем unknown для совместимости
interface TableComponentDTProps<T = unknown> {
  table: Table<T>
  getRowLink?: (row: T & { id: string }, type: string) => string
  hasEditDeleteActions?: boolean
  openFilters: boolean
  renderVirtualRow: ({
    row,
    virtualRow,
  }: {
    row: Row<T>
    virtualRow: VirtualItem
  }) => React.ReactNode
}

const TableRowsWrapper = <T = unknown>({
  table,
  openFilters,
  renderVirtualRow,
}: TableComponentDTProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null)
  const { rows } = table.getRowModel()
  const rowsCount = rows.length

  const { virtualItems, totalSize } = useVirtualizedRowTable<T>({
    rows,
    tableContainerRef,
  })

  return (
    <div
      className={cn("rounded-lg relative h-full overflow-auto border transition-all duration-200", {
        "max-h-[68vh]": openFilters,
        "max-h-[75vh]": !openFilters,
      })}
      ref={tableContainerRef}
    >
      {rowsCount > 0 && (
        <p className="border rounded-md px-2 py-1 m-1 w-fit bg-[#3071fc] text-white dark:bg-black">
          Количество выбранных заявок: {rowsCount}
        </p>
      )}
      {rowsCount > 0 ? (
        <TableTemplate table={table} totalSize={totalSize}>
          <VirtualRow
            renderRow={({ row, virtualRow }) => renderVirtualRow({ row, virtualRow })}
            rows={rows}
            virtualItems={virtualItems}
          />
        </TableTemplate>
      ) : (
        <p className="border rounded-md flex items-center justify-center w-full px-2 py-1 bg-stone-700 text-white dark:bg-black">
          Нет данных
        </p>
      )}
    </div>
  )
}

export default TableRowsWrapper
