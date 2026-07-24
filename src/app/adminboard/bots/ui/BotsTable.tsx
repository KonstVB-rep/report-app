"use client"

import type { BotWithChats } from "@/entities/tgBot/types"
import { TableRow } from "@/shared/components/ui/table"
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog"
import TableCellComponent from "@/shared/custom-components/ui/Table/TableCellCompoment"
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate"
import { useTableState } from "@/shared/hooks/useTableState"
import { NOT_GROW_COLS } from "@/shared/lib/constants"
import RowNumber from "@/shared/lib/tanstack-table/columnsDataColsTemplate/RowNumber"
import type { ColumnDef } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { useCallback, useMemo, useState } from "react"
import BotActionsMenu from "./BotActionsMenu"

const columnsDataBots: ColumnDef<BotWithChats>[] = [
  { ...RowNumber<BotWithChats>() },
  {
    header: "Название",
    accessorKey: "botName",
    cell: ({ row }) => <div className="text-center font-medium">{row.getValue("botName")}</div>,
  },
  {
    header: "Описание",
    accessorKey: "description",
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">{row.getValue("description")}</div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <BotActionsMenu bot={row.original} />,
    size: 50,
    minSize: 50,
    maxSize: 50,
    enableResizing: false,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
  },
]

const ROW_STYLE = {
  width: "100%",
  display: "flex",
} as const

const DEFAULT_COLUMN_OPTIONS = {
  size: 200,
  minSize: 100,
}

const BotsTable = ({ bots }: { bots: BotWithChats[] }) => {
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null)

  const data = useMemo(() => bots || [], [bots])

  const { table } = useTableState(data, columnsDataBots, {
    defaultColumn: DEFAULT_COLUMN_OPTIONS,
  })

  const { rows } = table.getRowModel()

  const handleOpenInfo = useCallback(
    (id: string) => setOpenFullInfoCell((prev) => (prev === id ? null : id)),
    [],
  )

  return (
    <TableTemplate className="rounded-md" table={table}>
      {rows.map((row) => (
        <TableRow key={row.id} style={ROW_STYLE}>
          {row.getVisibleCells().map((cell, index) => {
            const columnId = cell.column.id

            const isNotGrow = NOT_GROW_COLS.includes(columnId)
            const flexValue = isNotGrow ? "0 0 auto" : "1 0 auto"

            if (cell.column.columnDef?.meta?.hidden) return null

            return (
              <TableCellComponent<BotWithChats>
                cell={cell}
                handleOpenInfo={handleOpenInfo}
                key={cell.id}
                styles={{
                  width: cell.column.getSize(),
                  minWidth: cell.column.columnDef.minSize,
                  maxWidth: cell.column.columnDef.maxSize,
                  flex: flexValue,
                  overflow: "hidden",
                  boxSizing: "border-box",
                }}
              >
                {openFullInfoCell === cell.id && cell.column.id !== "actions" ? (
                  <RowInfoDialog
                    closeFn={() => setOpenFullInfoCell(null)}
                    isActive
                    isTargetCell={true}
                    text={flexRender(cell.column.columnDef.cell, cell.getContext())}
                  />
                ) : null}
              </TableCellComponent>
            )
          })}
        </TableRow>
      ))}
    </TableTemplate>
  )
}

export default BotsTable
