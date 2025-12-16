"use client"

import { useCallback, useMemo, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import type { BotWithChats } from "@/entities/tgBot/types"
import { TableRow } from "@/shared/components/ui/table"
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog"
import TableCellComponent from "@/shared/custom-components/ui/Table/TableCellCompoment"
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate"
import { useTableState } from "@/shared/hooks/useTableState"
import RowNumber from "@/widgets/deal/model/columnsDataColsTemplate/RowNumber"
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
  const headerGroups = table.getHeaderGroups()
  const headers = headerGroups[0]?.headers

  const handleOpenInfo = useCallback(
    (id: string) => setOpenFullInfoCell((prev) => (prev === id ? null : id)),
    [],
  )

  return (
    <TableTemplate className="rounded-md" table={table}>
      {rows.map((row) => (
        <TableRow key={row.id} style={ROW_STYLE}>
          {row.getVisibleCells().map((cell, index) => {
            const header = headers?.[index]
            const cellStyle = header
              ? {
                  width: header.getSize(),
                  minWidth: header.column.columnDef.minSize,
                  maxWidth: header.column.columnDef.maxSize,
                }
              : undefined

            return (
              <TableCellComponent<BotWithChats>
                cell={cell}
                handleOpenInfo={handleOpenInfo}
                key={cell.id}
                styles={cellStyle}
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
