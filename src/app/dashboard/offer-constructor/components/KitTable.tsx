import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  type Row,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowDownUp } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import type { SerializedEquipmentKitItem } from "../lib/types"
import { defaultColumnsKitItems } from "../model/defaultColumns"

const KitTable = ({ data }: { data: SerializedEquipmentKitItem[] }) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    rowNumber: false,
  })

  const [columns] = useState<typeof defaultColumnsKitItems>(() => [...defaultColumnsKitItems])
  const table = useReactTable<SerializedEquipmentKitItem>({
    data,
    columns,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    defaultColumn: {
      minSize: 50,
      maxSize: 800,
    },
  })
  return (
    <div className="px-4 pb-8 mt-4 overflow-y-auto max-h-[80vh]">
      <div className="rounded-md border">
        <div className="grid">
          <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 border-b shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <div className="flex w-full" key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <div
                    className={cn(
                      "p-3 border-r border-zinc-600 relative h-auto flex flex-col justify-center items-center flex-shrink-0",
                      index === 0 && "rounded-tl-sm",
                      index === headerGroup.headers.length - 1 && "border-r-0 rounded-tr-sm",
                      header.column.id === "description" && "flex-1",
                    )}
                    key={header.id}
                    style={{
                      width: header.getSize(), // Прямая привязка к размеру из TanStack
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "grid items-center gap-1 w-full h-full text-primary select-none min-h-12",
                        )}
                      >
                        <span className="text-sm font-bold text-center">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>

                        {header.column.id !== "select" && (
                          <Button
                            className={cn(
                              "flex items-center justify-center w-fit mx-auto",
                              header.column.getCanSort() && "cursor-pointer",
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                            variant="ghost"
                          >
                            <ArrowDownUp />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="bg-transparent">
            {table.getRowModel().rows.map((row) => (
              <KitTableCell key={row.id} row={row} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KitTable

const KitTableCell = ({ row }: { row: Row<SerializedEquipmentKitItem> }) => {
  return (
    <div
      className={cn(
        "flex w-full border-b last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors",
      )}
      key={row.id}
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <div
            className={cn(
              "p-2 flex items-start justify-center border-r last:border-r-0 overflow-hidden text-sm min-h-[57px]",
              cell.column.id === "description" && "flex-1",
              cell.column.id === "select" && "grid place-content-center",
            )}
            key={cell.id}
            style={{
              width: cell.column.getSize(),
              maxWidth: cell.column.columnDef.maxSize,
            }}
          >
            <div className={cn("w-full", cell.column.id === "price" ? "text-end" : "text-start")}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </div>
        )
      })}
    </div>
  )
}
