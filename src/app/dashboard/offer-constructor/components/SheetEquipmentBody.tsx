import { Button } from "@/shared/components/ui/button"
import { SheetFooter } from "@/shared/components/ui/sheet"
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions"
import { PermissionEnum } from "@prisma/client"
import { rankItem } from "@tanstack/match-sorter-utils"
import {
  type ColumnFiltersState,
  type FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  type Row,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { useState } from "react"
import { useDeleteEquipments, useUpdateEquipments } from "../hooks/mutate"
import { useGetEquipments } from "../hooks/query"
import SkeletonSheetEquipment from "../lib/SkeletonSheetEquipment"
import type { EquipmentWithQuantity, SerializedEquipmentItem } from "../lib/types"
import { defaultColumnsEquipment } from "../model/defaultColumns"
import { addRows, selectActiveTarget, useOfferStoreTable } from "../store"
import { selectLocalItems, selectSetLocalItem, useEquipmentStore } from "../store/localtemsStore"
import AddNewEquipmentDialog from "./AddNewEquipmentDialog"
import AddToKitDialog from "./AddToKitDialog"
import EquipmentTable from "./EquipmentTable"

const fuzzyFilter: FilterFn<EquipmentWithQuantity> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank,
  })

  return itemRank.passed
}

const SheetEquipmentBody = () => {
  const { data: equipmets, isLoading } = useGetEquipments()

  const tableData = equipmets ?? []
  const localItems = useEquipmentStore(selectLocalItems)

  const [columns] = useState<typeof defaultColumnsEquipment>(() => [...defaultColumnsEquipment])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    rowNumber: false,
  })

  const table = useReactTable<SerializedEquipmentItem>({
    data: tableData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnVisibility,
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 60,
      maxSize: 1600,
    },
    autoResetPageIndex: false,
    meta: {
      localItems,
    },
  })

  const { rowSelection } = table.getState()
  const equipmentSelected = table.getRowModel().rows.filter((row) => rowSelection[row.id])

  if (isLoading) {
    return <SkeletonSheetEquipment />
  }

  return (
    <>
      <div className="flex gap-2">
        <AddNewEquipmentDialog />
        <DebouncedInput
          className="p-2 font-lg shadow border border-block"
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Поиск..."
          value={table.getState().globalFilter ?? ""}
        />
      </div>
      {equipmets?.length === 0 ? (
        <div className="text-xl text-center uppercase grid place-items-center">
          Список оборудования пуст
        </div>
      ) : (
        <>
          <EquipmentTable setLocalItem={selectSetLocalItem} table={table} />
          <SheetEquipmentFooter
            resetSelections={table.resetRowSelection}
            rowSelection={equipmentSelected}
          />
        </>
      )}
    </>
  )
}

export default SheetEquipmentBody

const SheetEquipmentFooter = ({
  rowSelection,
  resetSelections,
}: {
  rowSelection: Row<SerializedEquipmentItem>[]
  resetSelections: () => void
}) => {
  const ids: string[] = []

  const localItems = useEquipmentStore(selectLocalItems)

  const seleted = rowSelection.map((row) => {
    ids.push(row.original.id)
    return {
      ...row.original,
      rowId: crypto.randomUUID(),
      image: row.original.image ?? "",
      price: row.original.price ? row.original.price.toString() : "0,00",
      count: 1,
      totalPrice: "0",
      purchasePrice: "0",
      purchaseAmount: "0",
      delta: "0",
    }
  })

  const updatedItems = Object.entries(localItems).map(([id, fields]) => ({
    id,
    ...fields,
  }))

  const { mutate: deleteItems, isPending } = useDeleteEquipments()
  const { mutate: updateItems, isPending: isPendingUpdate } = useUpdateEquipments()

  const isSelected = useOfferStoreTable(selectActiveTarget)

  return (
    <SheetFooter className="p-1 z-50 flex gap-2">
      <ProtectedByPermissions permission={PermissionEnum.EQUIPMENT_DELETE}>
        {rowSelection.length > 0 && (
          <Button
            disabled={!ids.length}
            onClick={() => {
              deleteItems(ids)
              resetSelections()
            }}
          >
            {isPending ? (
              <span className="flex gap-2">
                <LoaderCircle className="w-5 h-5" />
                "Удаление..."
              </span>
            ) : (
              "Удалить"
            )}
          </Button>
        )}
      </ProtectedByPermissions>
      <Button
        disabled={!isSelected?.sectionId}
        onClick={() => {
          addRows(seleted)
          resetSelections()
        }}
      >
        Добавить в таблицу
      </Button>
      <ProtectedByPermissions permission={PermissionEnum.EQUIPMENT_MANAGEMENT}>
        <Button
          disabled={!Object.keys(localItems).length || isPendingUpdate}
          onClick={() => {
            updateItems(updatedItems)
            resetSelections()
          }}
        >
          {isPendingUpdate ? (
            <span className="flex gap-2">
              <LoaderCircle className="w-5 h-5" />
              "Обновление..."
            </span>
          ) : (
            "Обновить"
          )}
        </Button>
        <AddToKitDialog ids={ids} rowSelection={rowSelection} />
      </ProtectedByPermissions>
    </SheetFooter>
  )
}
