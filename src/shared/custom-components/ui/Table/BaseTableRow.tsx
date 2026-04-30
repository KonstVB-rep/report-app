import { TableRow } from "@/shared/components/ui/table"
import { flexRender, type Header, type Row } from "@tanstack/react-table"
import { useState } from "react"
import ContextRowTable from "../ContextRowTable"
import RowInfoDialog from "./RowInfoDialog"
import TableCellComponent from "./TableCellCompoment"

interface BaseEntity {
  id: string
  highlights?: string | null
  dealStatus?: string | null
}

type BaseTableRowProps<T extends BaseEntity> = {
  row: Row<T>
  virtualRow: { start: number; index: number }
  className?: string
  path?: string
  getContextMenuActions: (row: Row<T>) => {
    edit: {
      onClick: () => void
    }
    delete: { onClick: () => void }
    more: { onClick: () => void }
    color?: { onClick: () => void }
  }
  renderAdditionalInfo?: (row: Row<T>) => React.ReactNode
  headers?: Header<T, unknown>[]
  hasEditDeleteActions?: boolean
  highlight?: string
}

const BaseTableRow = <T extends BaseEntity>({
  row,
  virtualRow,
  className,
  path,
  getContextMenuActions,
  renderAdditionalInfo,
  headers,
  hasEditDeleteActions = true,
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
        {row.getVisibleCells().map((cell, index) => (
          <TableCellComponent
            cell={cell}
            handleOpenInfo={(id) => setOpenFullInfoCell(openFullInfoCell === id ? null : id)}
            key={cell.id}
            styles={{
              width: cell.column.getSize(),
              minWidth: cell.column.columnDef.minSize,
              flex: "0 0 auto",
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
        ))}
      </TableRow>
    </ContextRowTable>
  )
}

export default BaseTableRow
