import { type Dispatch, type SetStateAction, useState } from "react"
import {
  type Cell,
  flexRender,
  type HeaderGroup,
  type Row,
  type Table,
} from "@tanstack/react-table"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import { PERMISSIONS } from "@/shared/lib/constants"
import { cn } from "@/shared/lib/utils"
import type { Equipment, SerializedEquipmentItem } from "../lib/types"
import { selectedKitId, useEquipmentStore } from "../store/localtemsStore"

const fullWidthCols = ["name", "description"]

const EquipmentTable = ({
  table,
  setLocalItem,
}: {
  table: Table<SerializedEquipmentItem>
  setLocalItem: (id: string, columnId: string, value: string | boolean | Date | null) => void
}) => {
  return (
    <div className="grid gap-2 items-start">
      <div className="rounded-md border overflow-x-auto overflow-y-auto max-h-[calc(100vh-10rem)]">
        <div className="grid">
          <div className="sticky top-0 z-10 bg-white dark:bg-zinc-800 border-b shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <div className="flex w-full" key={headerGroup.id}>
                {headerGroup.headers.map((header, index) =>
                  header.id === "actions" ? (
                    <ProtectedByPermissions
                      key={header.id}
                      permission={PERMISSIONS.EQUIPMENT_MANAGEMENT}
                    >
                      <HeaderEquipment
                        header={header}
                        headerGroup={headerGroup}
                        index={index}
                        key={header.id}
                      />
                    </ProtectedByPermissions>
                  ) : (
                    <HeaderEquipment
                      header={header}
                      headerGroup={headerGroup}
                      index={index}
                      key={header.id}
                    />
                  ),
                )}
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

const HeaderEquipment = ({
  headerGroup,
  index,
  header,
}: {
  headerGroup: HeaderGroup<SerializedEquipmentItem>
  index: number
  header: HeaderGroup<SerializedEquipmentItem>["headers"][number]
}) => {
  return (
    <div
      className={cn(
        "p-3 border-r border-zinc-600 relative h-auto flex flex-col justify-center items-center flex-shrink-0",
        index === 0 && "rounded-tl-sm",
        index === headerGroup.headers.length - 1 && "border-r-0 rounded-tr-sm",
        fullWidthCols.includes(header.column.id) && "flex-1",
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
  )
}

const RowSheetEquipment = ({
  row,
  setLocalItem,
}: {
  row: Row<SerializedEquipmentItem>
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
        return cell.column.id === "actions" ? (
          <ProtectedByPermissions key={cell.id} permission={PERMISSIONS.EQUIPMENT_MANAGEMENT}>
            <CellEquipment
              cell={cell}
              isEdit={isEdit}
              localEdit={localEdit}
              setIsEdit={setIsEdit}
            />
          </ProtectedByPermissions>
        ) : (
          <CellEquipment
            cell={cell}
            isEdit={isEdit}
            key={cell.id}
            localEdit={localEdit}
            setIsEdit={setIsEdit}
          />
        )
      })}
    </div>
  )
}

const CellEquipment = ({
  cell,
  isEdit,
  setIsEdit,
  localEdit,
}: {
  cell: Cell<SerializedEquipmentItem, unknown>
  isEdit: boolean
  setIsEdit: Dispatch<SetStateAction<boolean>>
  localEdit: (id: string, field: keyof Equipment, value: Equipment[keyof Equipment]) => void
}) => {
  return (
    <div
      className={cn(
        "p-2 flex items-start justify-center border-r last:border-r-0 overflow-hidden text-sm min-h-[57px]",
        fullWidthCols.includes(cell.column.id) && "flex-1",
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
            localEdit(id, field as keyof Equipment, value),
        })}
      </div>
    </div>
  )
}
