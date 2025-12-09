import { useCallback } from "react"
import type { Row, Table } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import TableRowDealOrTask from "./TableRowDealOrTask"
import TableRowsWrapper from "./TableRowsWrapper"

interface TableComponentDTProps<T extends Record<string, unknown>> {
  table: Table<T>
  hasEditDeleteActions?: boolean
  openFilters: boolean
  entityType?: "deal" | "task"
}

const TableComponentDT = <T extends Record<string, unknown>>({
  table,
  hasEditDeleteActions = true,
  openFilters,
  entityType = "deal",
}: TableComponentDTProps<T>) => {
  const headers = table.getHeaderGroups()[0].headers

  const renderVirtualRow = useCallback(
    ({ row, virtualRow }: { row: Row<T>; virtualRow: VirtualItem }) => (
      <TableRowDealOrTask<T>
        entityType={entityType}
        hasEditDeleteActions={hasEditDeleteActions}
        headers={headers}
        key={row.id}
        row={row}
        virtualRow={virtualRow} // "deal" или "task"
      />
    ),
    [headers, hasEditDeleteActions, entityType],
  )

  return (
    <TableRowsWrapper openFilters={openFilters} renderVirtualRow={renderVirtualRow} table={table} />
  )
}

export default TableComponentDT
