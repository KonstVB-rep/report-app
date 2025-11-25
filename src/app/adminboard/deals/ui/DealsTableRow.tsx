"use client"

import type { Header, Row } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import type { VirtualItem } from "@tanstack/react-virtual"
import type { DealBase } from "@/entities/deal/types"
import { TableRow } from "@/shared/components/ui/table"
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog"
import TableCellComponent from "@/shared/custom-components/ui/Table/TableCellCompoment"

const DealsTableRow = ({
  row,
  virtualRow,
  headers,
  openFullInfoCell,
  setOpenFullInfoCell,
}: {
  row: Row<DealBase>
  virtualRow: VirtualItem
  headers: Header<DealBase, unknown>[]
  openFullInfoCell: string | null
  setOpenFullInfoCell: (id: string | null) => void
}) => (
  <TableRow
    key={row.id}
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
      <TableCellComponent<DealBase>
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
            isActive
            isTargetCell={true}
            text={flexRender(cell.column.columnDef.cell, cell.getContext())}
          />
        )}
      </TableCellComponent>
    ))}
  </TableRow>
)

export default DealsTableRow
