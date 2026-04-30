import { Button } from "@/shared/components/ui/button"
import { SheetFooter } from "@/shared/components/ui/sheet"
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput"
import { rankItem } from "@tanstack/match-sorter-utils"
import {
  ColumnFiltersState,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { useState } from "react"
import EquipmentTable from "./EquipmentTable"
import { useDeleteEquipments, useUpdateEquipments } from "../hooks/mutate"
import { useGetEquipments } from "../hooks/query"
import { EquipmentDb, Equipment } from "../lib/types"
import { addRows, selectActiveTarget, useOfferStoreTable } from "../store"
import AddNewEquipment from "./AddNewEquipment"
import { defaultColumnsEquipment } from "../model/defaultColumns"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank,
  })

  return itemRank.passed
}

const SheetEquipmentBody = () => {
  const { data: equipmets } = useGetEquipments()

  const tableData = equipmets ?? []

  const [localItems, setLocalItems] = useState<Record<string, Partial<EquipmentDb>>>({})
  const [columns] = useState<typeof defaultColumnsEquipment>(() => [...defaultColumnsEquipment])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    rowNumber: false,
  })

  const table = useReactTable<Equipment>({
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
  })

  if (!equipmets) {
    return <div>Загрузка данных...</div>
  }

  const { rowSelection } = table.getState()
  const equipmentSelected = table.getRowModel().rows.filter((row) => rowSelection[row.id])

  console.log(equipmets, "equipmets")

  return (
    <>
      <div className="flex gap-2">
        <AddNewEquipment />
        <DebouncedInput
          value={table.getState().globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder="Поиск..."
        />
      </div>
      <EquipmentTable table={table} setLocalItems={setLocalItems} />
      <SheetEquipmentFooter
        rowSelection={equipmentSelected}
        resetSelections={table.resetRowSelection}
        localItems={localItems}
      />
    </>
  )
}

export default SheetEquipmentBody

const SheetEquipmentFooter = ({
  rowSelection,
  resetSelections,
  localItems,
}: {
  rowSelection: Row<Equipment>[]
  resetSelections: () => void
  localItems: Record<string, Partial<EquipmentDb>>
}) => {
  const ids: string[] = []
  const seleted = rowSelection.map((row) => {
    ids.push(row.id)
    return {
      ...row.original,
      image: row.original.image ?? "",
      price: row.original.price.toString(),
      count: 0,
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
    <SheetFooter className="absolute bottom-0 right-0 left-0 bg-muted p-1 z-50 flex gap-2">
      <Button
        onClick={() => {
          addRows(seleted)
          resetSelections()
        }}
        disabled={!isSelected?.sectionId}
      >
        Добавить в таблицу
      </Button>
      <Button
        onClick={() => {
          updateItems(updatedItems)
        }}
        disabled={!Object.keys(localItems).length || isPendingUpdate}
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
      <Button onClick={() => deleteItems(ids)} disabled={!ids.length || isPending}>
        {isPending ? (
          <span className="flex gap-2">
            <LoaderCircle className="w-5 h-5" />
            "Удаление..."
          </span>
        ) : (
          "Удалить"
        )}
      </Button>
    </SheetFooter>
  )
}
