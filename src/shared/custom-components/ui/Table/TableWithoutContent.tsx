import { useState } from "react"
import type { Header, Row } from "@tanstack/react-table"
import { TableRow } from "@/shared/components/ui/table"
import TableCellComponent from "./TableCellCompoment"
import { getRowClassName } from "./TableRowDealOrTask"

type Props<T extends Record<string, unknown>> = {
  row: Row<T>
  virtualRow: { index: number; start: number }
  hasEditDeleteActions?: boolean
  entityType: string
  headers?: Header<T, unknown>[]
}

const TableWithoutContent = <T extends Record<string, unknown>>({
  row,
  virtualRow,
  headers,
}: Props<T>) => {
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null)

  const handleOpenInfo = (cellId: string) => {
    setOpenFullInfoCell(openFullInfoCell === cellId ? null : cellId)
  }

  return (
    <TableRow
      className={getRowClassName(row.original.dealStatus as string)}
      data-closed={row.original.dealStatus === "CLOSED"}
      data-progress={row.original.dealStatus === "PROGRESS"}
      data-reject={row.original.dealStatus === "REJECT"}
      data-success={row.original.dealStatus === "PAID"}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        transform: `translateY(${virtualRow.start}px)`,
        display: "flex",
      }}
    >
      {row.getVisibleCells().map((cell, index) => {
        return (
          <TableCellComponent<T>
            cell={cell}
            handleOpenInfo={handleOpenInfo}
            key={cell.id}
            styles={{
              width: headers?.[index]?.getSize(),
              minWidth: headers?.[index]?.column.columnDef.minSize,
              maxWidth: headers?.[index]?.column.columnDef.maxSize,
            }}
          />
        )
      })}
    </TableRow>
  )
}

export default TableWithoutContent
