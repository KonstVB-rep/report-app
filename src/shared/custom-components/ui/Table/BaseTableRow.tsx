import { useState } from "react"
import { flexRender, type Header, type Row } from "@tanstack/react-table"
import { TableRow } from "@/shared/components/ui/table"
import ContextRowTable from "../ContextRowTable"
import RowInfoDialog from "./RowInfoDialog"
import TableCellComponent from "./TableCellCompoment"

interface BaseEntity {
  id: string
}

type BaseTableRowProps<T extends BaseEntity> = {
  row: Row<T>
  virtualRow: { start: number; index: number }
  className?: string
  path?: string
  getContextMenuActions: (
    setOpenModal: React.Dispatch<React.SetStateAction<"delete" | "edit" | "more" | null>>,
    row: Row<T>,
  ) => {
    edit: React.ReactNode
    delete: React.ReactNode
  }
  renderAdditionalInfo?: (row: Row<T>) => React.ReactNode
  headers?: Header<T, unknown>[]
}

const BaseTableRow = <T extends { id: string }>({
  row,
  virtualRow,
  className,
  path,
  getContextMenuActions,
  renderAdditionalInfo,
  headers,
}: BaseTableRowProps<T>) => {
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null)

  return (
    <ContextRowTable
      modals={getContextMenuActions ? (set) => getContextMenuActions(set, row) : undefined}
      path={path}
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
        }}
      >
        {row.getVisibleCells().map((cell, index) => (
          <TableCellComponent
            cell={cell}
            handleOpenInfo={(id) => setOpenFullInfoCell(openFullInfoCell === id ? null : id)}
            key={cell.id}
            styles={{
              width: headers?.[index]?.getSize(),
              minWidth: headers?.[index]?.column.columnDef.minSize,
              maxWidth: headers?.[index]?.column.columnDef.maxSize,
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
