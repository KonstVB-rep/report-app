import { cn } from "@/shared/lib/utils"
import { EquipmentItem } from "@prisma/client"
import { flexRender, Table, Row } from "@tanstack/react-table"
import { Dispatch, SetStateAction, useState } from "react"
import { EquipmentDb, Equipment } from "../lib/types"

const EquipmentTable = ({
  table,
  setLocalItems,
}: {
  table: Table<Equipment>
  setLocalItems: Dispatch<SetStateAction<Record<string, Partial<EquipmentDb>>>>
}) => {
  return (
    <>
      <div className="grid gap-2">
        <div className="rounded-md border overflow-x-auto overflow-y-auto max-h-[calc(100vh-10rem)]">
          <div className="grid">
            <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 border-b shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <div key={headerGroup.id} className="flex w-full">
                  {headerGroup.headers.map((header, index) => (
                    <div
                      key={header.id}
                      className={cn(
                        "p-3 border-r border-zinc-600 relative h-auto flex flex-col justify-center items-center flex-shrink-0",
                        index === 0 && "rounded-tl-sm",
                        index === headerGroup.headers.length - 1 && "border-r-0 rounded-tr-sm",
                        header.column.id === "description" && "flex-1",
                      )}
                      style={{
                        width: header.getSize(), // Прямая привязка к размеру из TanStack
                        minWidth: header.column.columnDef.minSize,
                        maxWidth: header.column.columnDef.maxSize,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center justify-center gap-1 w-full h-full text-primary select-none",
                            header.column.getCanSort() && "cursor-pointer",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="text-xs font-bold text-center uppercase tracking-wider">
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
                <RowSheetEquipment key={row.id} row={row} setLocalItems={setLocalItems} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EquipmentTable

const RowSheetEquipment = ({
  row,
  setLocalItems,
}: {
  row: Row<Equipment>
  setLocalItems: Dispatch<SetStateAction<Record<string, Partial<EquipmentDb>>>>
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const localEdit = <K extends keyof Equipment>(id: string, field: K, value: Equipment[K]) => {
    setLocalItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }
  return (
    <div
      key={row.id}
      className="flex w-full border-b last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <div
            key={cell.id}
            className={cn(
              "p-2 flex items-center justify-center border-r last:border-r-0 overflow-hidden text-sm min-h-[57px]",
              cell.column.id === "description" && "flex-1",
            )}
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
                  localEdit(id, field as keyof EquipmentItem, value as Equipment[keyof Equipment]),
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
