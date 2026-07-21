import { useCallback } from "react"
import type { Row, Table } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import type { DealUnion } from "@/entities/deal/types"
import { DealTableRow } from "@/entities/deal/ui/DealTableRow"
import TableRowsWrapper from "./TableRowsWrapper"

interface TableComponentProps<T extends DealUnion> {
  table: Table<T>
  hasEditDeleteActions?: boolean
  openFilters: boolean
}

const TableComponent = <T extends DealUnion>({
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
    <TableRowsWrapper openFilters={openFilters} renderVirtualRow={renderVirtualRow} table={table} />
  )
}

export default TableComponent
