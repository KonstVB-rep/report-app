import { useCallback } from "react"
import type { Row, Table } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import type { BaseDeal } from "@/entities/deal/types"
import { DealTableRow } from "@/entities/deal/ui/DealTableRow"
import TableRowsWrapper from "./TableRowsWrapper"

interface TableComponentProps<T extends BaseDeal> {
  table: Table<T>
  hasEditDeleteActions?: boolean
  openFilters: boolean
}

const TableComponent = <T extends BaseDeal>({
  table,
  hasEditDeleteActions = true,
  openFilters,
}: TableComponentProps<T>) => {
  const renderVirtualRow = useCallback(
    ({ row, virtualRow }: { row: Row<T>; virtualRow: VirtualItem }) => (
      <DealTableRow<T>
        hasEditDeleteActions={hasEditDeleteActions}
        key={row.id}
        row={row}
        virtualRow={virtualRow}
      />
    ),
    [hasEditDeleteActions],
  )

  return (
    <TableRowsWrapper<T>
      openFilters={openFilters}
      renderVirtualRow={renderVirtualRow}
      table={table}
    />
  )
}

export default TableComponent
