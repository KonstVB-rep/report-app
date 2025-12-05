import { useState } from "react"
import { type Header, type Row } from "@tanstack/react-table"
import { TableRow } from "@/shared/components/ui/table"
import TableCellComponent from "./TableCellCompoment"

type Props<T extends Record<string, unknown>> = {
  row: Row<T>
  virtualRow: { index: number; start: number }
  hasEditDeleteActions?: boolean
  entityType: string
  headers?: Header<T, unknown>[]
}

export const getRowClassName = (dealStatus?: string) => {
  const baseClass = "tr hover:bg-zinc-600 hover:text-white relative"
  if (!dealStatus) return baseClass

  return `${baseClass} ${
    dealStatus === "CLOSED"
      ? "bg-green-950/50 darK:bg-green-950/30 dark:opacity-60"
      : dealStatus === "REJECT"
        ? "bg-red-900/40 dark:bg-red-900/40 opacity-80 dark:opacity-60"
        : dealStatus === "PAID"
          ? "bg-green-100 dark:bg-lime-200/20"
          : ""
  }`
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
