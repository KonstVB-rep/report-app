import { Fragment } from "react"
import { flexRender, type Header, type Row } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import { TableRow } from "@/shared/components/ui/table"
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog"
import TableCellComponent from "@/shared/custom-components/ui/Table/TableCellCompoment"
import type { EventInputType } from "../../types"

interface EventTableRowProps {
  row: Row<EventInputType>
  virtualRow: VirtualItem
  headers: Header<EventInputType, unknown>[]
  openFullInfoCell: string | null
  onOpenInfo: (rowId: string) => void
  onCloseInfo: () => void
}

const EventTableRow = ({
  row,
  virtualRow,
  headers,
  openFullInfoCell,
  onOpenInfo,
  onCloseInfo,
}: EventTableRowProps) => {
  return (
    <TableRow
      key={row.id}
      onDoubleClick={() => onOpenInfo(row.original.id || "")}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        transform: `translateY(${virtualRow.start}px)`,
        display: "flex",
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <Fragment key={cell.id}>
          {openFullInfoCell === row.original.id && (
            <RowInfoDialog
              closeFn={onCloseInfo}
              isActive={true}
              isTargetCell={true}
              key={cell.id}
              text={flexRender(cell.column.columnDef.cell, cell.getContext())}
            />
          )}
        </Fragment>
      ))}

      {row.getVisibleCells().map((cell, index) => (
        <TableCellComponent<EventInputType>
          cell={cell}
          handleOpenInfo={onOpenInfo}
          key={cell.id}
          styles={{
            width: headers?.[index]?.getSize(),
            minWidth: headers?.[index]?.column.columnDef.minSize,
            maxWidth: headers?.[index]?.column.columnDef.maxSize,
          }}
        />
      ))}
    </TableRow>
  )
}

export default EventTableRow
