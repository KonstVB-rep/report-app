import type { DealUnion } from "@/entities/deal/types"
import { DealTableRow } from "@/entities/deal/ui/DealTableRow"
import { type Row, type Table } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import { useCallback, useMemo } from "react"
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
  const headers = useMemo(() => table.getHeaderGroups()[0].headers, [table])

  const renderVirtualRow = useCallback(
    ({ row, virtualRow }: { row: Row<T>; virtualRow: VirtualItem }) => (
      <DealTableRow<T>
        hasEditDeleteActions={hasEditDeleteActions}
        headers={headers}
        key={row.id}
        row={row}
        virtualRow={virtualRow}
      />
    ),
    [headers, hasEditDeleteActions],
  )

  return (
    <TableRowsWrapper openFilters={openFilters} renderVirtualRow={renderVirtualRow} table={table} />
  )
}

export default TableComponent
