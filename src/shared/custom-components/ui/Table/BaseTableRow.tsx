import { useState } from "react"
import { flexRender, type Row } from "@tanstack/react-table"
import { TableRow } from "@/shared/components/ui/table"
import { NOT_GROW_COLS } from "@/shared/lib/constants"
import ContextRowTable, { ContextRowTaskTable } from "../ContextRowTable"
import RowInfoDialog from "./RowInfoDialog"
import TableCellComponent from "./TableCellCompoment"

interface BaseEntity {
  id: string
  highlights?: string | null
  dealStatus?: string | null
}

function renderCells<T extends BaseEntity>({
  row,
  openFullInfoCell,
  setOpenFullInfoCell,
  renderAdditionalInfo,
}: {
  row: Row<T>
  openFullInfoCell: string | null
  setOpenFullInfoCell: (v: string | null) => void
  renderAdditionalInfo?: (row: Row<T>) => React.ReactNode
}) {
  return row.getVisibleCells().map((cell) => {
    const columnId = cell.column.id

    const isNotGrow = NOT_GROW_COLS.includes(columnId)
    const flexValue = isNotGrow ? "0 0 auto" : "1 0 auto"

    if (cell.column.columnDef?.meta?.hidden) return null

    return (
      <TableCellComponent
        cell={cell}
        handleOpenInfo={(id) => setOpenFullInfoCell(openFullInfoCell === id ? null : id)}
        key={cell.id}
        styles={{
          width: cell.column.getSize(),
          minWidth: cell.column.columnDef.minSize || 60,
          flex: flexValue,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {openFullInfoCell === cell.id && (
          <RowInfoDialog
            closeFn={() => setOpenFullInfoCell(null)}
            isActive={true}
            text={flexRender(cell.column.columnDef.cell, cell.getContext())}
          >
            {renderAdditionalInfo?.(row)}
          </RowInfoDialog>
        )}
      </TableCellComponent>
    )
  })
}

type BaseTableRowProps<T extends BaseEntity> = {
  row: Row<T>
  virtualRow: { start: number; index: number }
  className?: string
  getContextMenuActions: (row: Row<T>) => {
    edit: {
      onClick: () => void
    }
    delete: { onClick: () => void }
    more: { onClick: () => void }
    color?: { onClick: () => void }
  }
  renderAdditionalInfo?: (row: Row<T>) => React.ReactNode
  path?: string
  hasEditDeleteActions?: boolean
  highlight?: string
}

const TaskRow = <T extends BaseEntity>({
  row,
  virtualRow,
  className,
  getContextMenuActions,
  renderAdditionalInfo,
  hasEditDeleteActions = true,
}: Omit<BaseTableRowProps<T>, "path">) => {
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null)

  return (
    <ContextRowTaskTable
      hasEditDeleteActions={hasEditDeleteActions}
      openModal={getContextMenuActions ? () => getContextMenuActions(row) : undefined}
    >
      <TableRow
        className={className}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          transform: `translateY(${virtualRow.start}px)`,
          display: "flex",
          backgroundColor: row.original.highlights ?? "",
        }}
      >
        {renderCells({
          row: row,
          openFullInfoCell,
          setOpenFullInfoCell,
          renderAdditionalInfo: renderAdditionalInfo,
        })}
      </TableRow>
    </ContextRowTaskTable>
  )
}

const BaseTableRow = <T extends BaseEntity>({
  row,
  virtualRow,
  className,
  getContextMenuActions,
  renderAdditionalInfo,
  hasEditDeleteActions = true,
  path,
}: BaseTableRowProps<T>) => {
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null)

  return (
    <ContextRowTable
      dealStatus={row.original.dealStatus}
      hasEditDeleteActions={hasEditDeleteActions}
      openModal={getContextMenuActions ? () => getContextMenuActions(row) : undefined}
      path={path}
    >
      <TableRow
        className={className}
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
          backgroundColor: row.original.highlights ?? "",
        }}
      >
        {renderCells({
          row: row,
          openFullInfoCell,
          setOpenFullInfoCell,
          renderAdditionalInfo: renderAdditionalInfo,
        })}
      </TableRow>
    </ContextRowTable>
  )
}

BaseTableRow.Task = TaskRow

export default BaseTableRow
