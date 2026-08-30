import { useState } from "react"
import type { Header, Row } from "@tanstack/react-table"
import type { BaseDeal } from "@/entities/deal/types"
import { TableRow } from "@/shared/components/ui/table"
import { NOT_GROW_COLS } from "@/shared/lib/constants"
import { getRowClassName } from "@/shared/lib/helpers/getRowClassName"
import TableCellComponent from "./TableCellCompoment"

type Props<T extends BaseDeal> = {
  row: Row<T>
  virtualRow: { index: number; start: number }
  hasEditDeleteActions?: boolean
  entityType: string
  headers?: Header<T, unknown>[]
}

const TableWithoutContent = <T extends BaseDeal>({ row, virtualRow }: Props<T>) => {
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
      {row.getVisibleCells().map((cell) => {
        const columnId = cell.column.id

        const isNotGrow = NOT_GROW_COLS.includes(columnId)
        const flexValue = isNotGrow ? "0 0 auto" : "1 0 auto"

        if (cell.column.columnDef?.meta?.hidden) return null
        return (
          <TableCellComponent<T>
            cell={cell}
            handleOpenInfo={handleOpenInfo}
            key={cell.id}
            styles={{
              width: cell.column.getSize(),
              minWidth: cell.column.columnDef.minSize || 60,
              flex: flexValue,
            }}
          />
        )
      })}
    </TableRow>
  )
}

export default TableWithoutContent
