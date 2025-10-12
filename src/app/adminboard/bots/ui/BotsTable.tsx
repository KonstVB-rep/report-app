import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { EllipsisVertical } from "lucide-react"
import type { BotWithChats } from "@/entities/tgBot/types"
import DialogChatsBot from "@/feature/telegramBot/ui/DialogChatsBot"
import DialogCreateChatForm from "@/feature/telegramBot/ui/DialogCreateChatForm"
import DialogDeleteBot from "@/feature/telegramBot/ui/DialogDeleteBot"
import DialogEditBot from "@/feature/telegramBot/ui/DialogEditBot"
import { Button } from "@/shared/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { TableRow } from "@/shared/components/ui/table"
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog"
import TableCellComponent from "@/shared/custom-components/ui/Table/TableCellCompoment"
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate"
import { useTableState } from "@/shared/hooks/useTableState"
import RowNumber from "@/widgets/deal/model/columnsDataColsTemplate/RowNumber"

const columnsDataBots: ColumnDef<BotWithChats, unknown>[] = [
  {
    ...RowNumber<BotWithChats>(),
  },
  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  //    {...SelectColDataColumn<BotWithChats>()},
  {
    header: "Название",
    accessorKey: "botName",
    cell: ({ row }) => <div className="text-center">{row.getValue("botName")}</div>,
  },
  {
    header: "Описание",
    accessorKey: "description",
    cell: ({ row }) => <div className="text-center">{row.getValue("description")}</div>,
  },
  {
    header: "",
    accessorKey: "actions",
    cell: ({ row }) => {
      const data = row.original
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="outline">
              <EllipsisVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="grid gap-4">
              <DialogEditBot bot={data} />

              <DialogDeleteBot bot={data} />

              {data.chats.length > 0 ? (
                <DialogChatsBot bot={data} />
              ) : (
                <DialogCreateChatForm bot={data} />
              )}
            </div>
          </PopoverContent>
        </Popover>
      )
    },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    enableMultiSort: false,
    enableGlobalFilter: false,
    enableGrouping: false,
    maxSize: 80,
  },
]

const BotsTable = ({ bots }: { bots: BotWithChats[] }) => {
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null)

  const { table } = useTableState(bots || [], columnsDataBots)

  const { rows } = table.getRowModel()
  const headers = table.getHeaderGroups()[0].headers

  return (
    <TableTemplate className="rounded-md" table={table}>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          style={{
            width: "100%",
            display: "flex",
          }}
        >
          {row.getVisibleCells().map((cell, index) => {
            return (
              <TableCellComponent<BotWithChats>
                cell={cell}
                handleOpenInfo={(id) => setOpenFullInfoCell(openFullInfoCell === id ? null : id)}
                key={cell.id}
                styles={{
                  width: headers?.[index]?.getSize(),
                  minWidth: headers?.[index]?.column.columnDef.minSize,
                  maxWidth: headers?.[index]?.column.columnDef.maxSize,
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
