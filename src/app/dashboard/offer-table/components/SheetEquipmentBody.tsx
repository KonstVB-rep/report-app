import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { SheetFooter } from "@/shared/components/ui/sheet"
import { Textarea } from "@/shared/components/ui/textarea"
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput"
import { cn, formatterCurrency } from "@/shared/lib/utils"
import RowNumber from "@/widgets/deal/model/columnsDataColsTemplate/RowNumber"
import { EquipmentItem } from "@prisma/client"
import { CheckedState } from "@radix-ui/react-checkbox"
import { rankItem } from "@tanstack/match-sorter-utils"
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Check, MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import EquipmentTable from "./EquipmentTable"
import { useDeleteEquipments, useUpdateEquipments } from "../hooks/mutate"
import { useGetEquipments } from "../hooks/query"
import { EquipmentDb, Equipment } from "../lib/types"
import { addRows } from "../store"
import AddNewEquipment from "./AddNewEquipment"

const defaultColumns: ColumnDef<Equipment>[] = [
  {
    ...RowNumber<Equipment>(),
  },
  {
    id: "id",
    enableHiding: true,
    enableSorting: false,
    accessorFn: (row: Equipment) => row.id,
    meta: {
      title: "id",
      isNotSearchable: true,
      hidden: true,
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Label className={cn("flex items-center justify-center cursor-pointer gap-1")}>
        {table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected() ? (
          <Check />
        ) : (
          "Выбрать"
        )}
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="opacity-0 w-0 h-0"
          onCheckedChange={(value: CheckedState) => table.toggleAllPageRowsSelected(!!value)}
        />
      </Label>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value: CheckedState) => row.toggleSelected(!!value)}
        />
      </div>
    ),
    accessorFn: (row) => row.id,
    enableSorting: false,
    enableHiding: false,
    minSize: 80,
    maxSize: 80,
  },
  {
    id: "name",
    header: "Наименование",
    cell: ({ row, column, getValue, isEdit, localEditData }) => {
      const initialValue = getValue() as string

      const [value, setValue] = useState<string>(initialValue)

      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      return isEdit ? (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          // Сохраняем в общий черновик только когда ушли из инпута
          onBlur={() => localEditData(row.id, column.id, value)}
          className={cn(
            "w-full text-start text-black dark:text-white bg-white dark:bg-black p-2",
            value !== initialValue && "border-blue-500",
          )}
        />
      ) : (
        value
      )
    },
    meta: {
      title: "Наименование",
    },
    accessorFn: (row: Equipment) => row.name,
  },
  {
    id: "description",
    header: "Описание",
    cell: ({ row, column, getValue, isEdit, localEditData }) => {
      const initialValue = getValue() as string

      const [value, setValue] = useState<string>(initialValue)

      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      return isEdit ? (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => localEditData(row.id, column.id, value)}
          className={cn(
            "w-full text-start text-black dark:text-white bg-white dark:bg-black",
            value !== initialValue && "border-blue-500",
          )}
        />
      ) : (
        value
      )
    },
    meta: {
      title: "Описание",
    },
    accessorFn: (row: Equipment) => row.description,
  },
  {
    id: "price",
    header: "Цена",
    cell: ({ row, column, getValue, isEdit, localEditData }) => {
      const initialValue = getValue() as string

      const [value, setValue] = useState<string>(initialValue)

      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])
      return isEdit ? (
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => localEditData(row.id, column.id, value)}
          className={cn(
            "w-full text-end text-black dark:text-white bg-white dark:bg-black",
            value !== initialValue && "border-blue-500",
          )}
        />
      ) : (
        formatterCurrency.format(parseFloat(getValue() as string))
      )
    },
    enableHiding: true,
    meta: {
      title: "Цена",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: Equipment) => row.price,
  },
  {
    id: "actions",
    header: "",
    size: 100,
    maxSize: 100,
    accessorFn: (row) => row.id,
    cell: ({ row, isEdit, setIsEdit }) => {
      const handleClick = () => {
        setIsEdit((prev: boolean) => !prev)
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Удалить</DropdownMenuItem>
            <DropdownMenuItem onClick={handleClick}>Изменить</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

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
  const [columns] = useState<typeof defaultColumns>(() => [...defaultColumns])
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

  console.log(localItems, "localItems")

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
  const { mutate: deleteItems } = useDeleteEquipments()
  const { mutate: updateItems } = useUpdateEquipments()

  return (
    <SheetFooter className="absolute bottom-0 right-0 left-0 bg-muted p-1 z-50 flex gap-2">
      <Button
        onClick={() => {
          addRows(seleted)
          resetSelections()
        }}
      >
        Добавить в таблицу
      </Button>
      <Button
        onClick={() => {
          updateItems(updatedItems)
        }}
      >
        Обновить
      </Button>
      <Button onClick={() => deleteItems(ids)}>Удалить</Button>
    </SheetFooter>
  )
}
