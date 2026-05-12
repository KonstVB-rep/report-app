import { useMemo, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  type Row,
  type Table,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowDownUp } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import { cn } from "@/shared/lib/utils"
import { useAddItemsToKit } from "../hooks/mutate"
import type { EquipmentWithQuantity, SerializedEquipmentKitItem } from "../lib/types"
import { defaultColumnsKitEquipment } from "../model/defaultColumns"
import {
  selectedKitId,
  selectedKits,
  selectSetLocalItem,
  selectSetLocalKit,
  selectSetSelectedKitId,
  useEquipmentStore,
} from "../store/localtemsStore"

const AddToKitDialog = ({
  rowSelection,
  ids,
}: {
  rowSelection: Row<EquipmentWithQuantity>[]
  ids: string[]
}) => {
  const columns = useMemo(() => defaultColumnsKitEquipment, [])

  const [open, setOpen] = useState(false)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    rowNumber: false,
  })
  const { mutate: addToKit, isPending: isPendingKit } = useAddItemsToKit()

  const selectedKitIdCurrent = useEquipmentStore(selectedKitId)
  const selectedKitsItems = useEquipmentStore(selectedKits)

  const kitItemList = useEquipmentStore(selectedKits)

  const table = useReactTable<EquipmentWithQuantity>({
    data: kitItemList,
    columns,
    state: {
      columnVisibility,
    },
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
  })

  const selectKitId = useEquipmentStore(selectedKitId)

  const allRows = useMemo(() => {
    return rowSelection.map((row) => ({ ...row.original, count: 1 }))
  }, [rowSelection])

  const handleAddToKitLocal = () => {
    if (!selectKitId) {
      toast.error("Сначала выберите комплект!")
      return
    }
    selectSetLocalKit(allRows)
  }

  const handleAddToKit = () => {
    if (!selectedKitIdCurrent) {
      toast.error("Сначала выберите комплект!")
      return
    }
    addToKit({
      kitId: selectedKitIdCurrent,
      itemsKit: selectedKitsItems,
    })
    selectSetSelectedKitId(null)
    table.resetRowSelection()
  }

  const handlDeleteItemFromKitLocal = () => {
    const { rowSelection } = table.getState()

    const remainingItems = kitItemList.filter((item) => !rowSelection[item.id])
    selectSetLocalKit(remainingItems)

    if (remainingItems.length === 0) {
      setOpen(false)
      selectSetSelectedKitId(null)
    }
    table.resetRowSelection()
  }

  return (
    <DialogComponent
      classNameContent="w-full sm:max-w-[1200px]"
      dialogTitle="Добавить в комплект"
      onOpenChange={setOpen}
      open={open}
      trigger={
        <Button disabled={!ids.length} onClick={handleAddToKitLocal}>
          Добавить в комплект
        </Button>
      }
    >
      <div className="grid gap-2 ">
        <EquipmentKitTable setLocalItem={selectSetLocalItem} table={table} />
        <div className="flex gap-2 justify-end">
          <Button className="w-fit" disabled={isPendingKit} onClick={handleAddToKit}>
            {isPendingKit ? "Идет добавление..." : "Подтвердить добавление"}
          </Button>
          <Button className="w-fit" onClick={handlDeleteItemFromKitLocal}>
            Удалить из списка
          </Button>
        </div>
      </div>
    </DialogComponent>
  )
}

const EquipmentKitTable = ({
  table,
  setLocalItem,
}: {
  table: Table<EquipmentWithQuantity>
  setLocalItem: (
    id: string,
    columnId: string,
    value: string | number | boolean | Date | SerializedEquipmentKitItem[] | null | undefined,
  ) => void
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
              <RowSheetEquipmentKit key={row.id} row={row} setLocalItem={setLocalItem} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const RowSheetEquipmentKit = ({
  row,
  setLocalItem,
}: {
  row: Row<EquipmentWithQuantity>
  setLocalItem: (
    id: string,
    columnId: string,
    value: string | number | boolean | Date | SerializedEquipmentKitItem[] | null | undefined,
  ) => void
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const localEdit = <K extends keyof EquipmentWithQuantity>(
    id: string,
    field: K,
    value: EquipmentWithQuantity[K],
  ) => {
    setLocalItem(id, field, value)
    setIsEdit(false)
  }

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
              {flexRender(cell.column.columnDef.cell, {
                ...cell.getContext(),
                isEdit,
                setIsEdit,
                localEditData: (id: string, field: string, value: string) =>
                  localEdit(
                    id,
                    field as keyof EquipmentWithQuantity,
                    value as EquipmentWithQuantity[keyof EquipmentWithQuantity],
                  ),
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AddToKitDialog
