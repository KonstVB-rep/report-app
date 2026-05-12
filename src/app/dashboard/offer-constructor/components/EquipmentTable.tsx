import { useState } from "react"
import { flexRender, type Row, type Table } from "@tanstack/react-table"
import { cn } from "@/shared/lib/utils"
import type { Equipment, EquipmentWithQuantity } from "../lib/types"
import { selectedKitId, useEquipmentStore } from "../store/localtemsStore"

const EquipmentTable = ({
  table,
  setLocalItem,
}: {
  table: Table<EquipmentWithQuantity>
  setLocalItem: (id: string, columnId: string, value: string | boolean | Date | null) => void
}) => {
  return (
    <div className="grid gap-2 items-start">
      <div className="rounded-md border overflow-x-auto overflow-y-auto max-h-[calc(100vh-10rem)]">
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
                          "flex items-center justify-center gap-1 w-full h-full text-primary select-none min-h-12",
                        )}
                      >
                        <span className="text-sm font-bold text-center tracking-wider">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="bg-transparent">
            {table.getRowModel().rows.map((row) => (
              <RowSheetEquipment key={row.id} row={row} setLocalItem={setLocalItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EquipmentTable

const RowSheetEquipment = ({
  row,
  setLocalItem,
}: {
  row: Row<EquipmentWithQuantity>
  setLocalItem: (id: string, columnId: string, value: string | boolean | Date | null) => void
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const localEdit = <K extends keyof Equipment>(id: string, field: K, value: Equipment[K]) => {
    setLocalItem(id, field, value)
    setIsEdit(false)
  }
  const isKit = row.original.isKit
  const selectKitId = useEquipmentStore(selectedKitId)

  return (
    <div
      className={cn(
        "flex w-full border-b last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors",
        isKit && "bg-zinc-50 dark:bg-zinc-900/50 shadow-[inset_4px_0_0_0] shadow-chart-1",
        selectKitId === row.original.id && "shadow-[inset_0_0_0_4px] shadow-chart-1 opacity-80",
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
              {flexRender(cell.column.columnDef.cell, {
                ...cell.getContext(),
                isEdit,
                setIsEdit,
                localEditData: (id: string, field: string, value: string) =>
                  localEdit(id, field as keyof Equipment, value as Equipment[keyof Equipment]),
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
