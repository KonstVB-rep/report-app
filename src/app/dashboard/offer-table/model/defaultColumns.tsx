import { cn, formatterCurrency } from "@/shared/lib/utils"
import RowNumber from "@/widgets/deal/model/columnsDataColsTemplate/RowNumber"
import { ColumnDef, CellContext } from "@tanstack/react-table"
import { OfferTableItem } from "../store"
import { Textarea } from "@/shared/components/ui/textarea"
import { Check, MoreHorizontal } from "lucide-react"
import { useState, useEffect } from "react"
import { Equipment } from "../lib/types"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
import { CheckedState } from "@radix-ui/react-checkbox"
import { Input } from "@/shared/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Button } from "@/shared/components/ui/button"

export const defaultColumns: ColumnDef<OfferTableItem>[] = [
  {
    ...RowNumber<OfferTableItem>(),
  },
  {
    id: "id",
    enableHiding: true,
    enableSorting: false,
    accessorFn: (row: OfferTableItem) => row.id,
    meta: {
      title: "id",
      isNotSearchable: true,
      hidden: true,
    },
  },
  {
    id: "name",
    header: "Наименование",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = info.getValue()
      return value
    },
    meta: {
      title: "Наименование",
    },
    accessorFn: (row: OfferTableItem) => row.name,
  },
  {
    id: "description",
    header: "Описание",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = info.getValue()
      return value
    },
    meta: {
      title: "Описание",
    },
    accessorFn: (row: OfferTableItem) => row.description,
  },
  {
    id: "price",
    header: "Цена",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      return formatterCurrency.format(parseFloat(info.getValue() as string))
    },
    enableHiding: true,
    meta: {
      title: "Цена",
    },
    accessorFn: (row: OfferTableItem) => row.price,
  },
  {
    id: "count",
    header: "Количество",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      return info.getValue()
    },
    enableHiding: true,
    meta: {
      title: "Количество",
    },
    accessorFn: (row: OfferTableItem) => row.count,
  },
  {
    id: "totalPrice",
    header: "Итого, руб.",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      return formatterCurrency.format(parseFloat(info.getValue() as string))
    },
    enableHiding: true,
    meta: {
      title: "Итого, руб.",
    },
    accessorFn: (row: OfferTableItem) => row.totalPrice,
  },
  {
    id: "purchasePrice",
    header: "Цена закупки",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = formatterCurrency.format(parseFloat(info.getValue() as string))
      return <div>{value}</div>
    },
    enableHiding: true,
    meta: {
      title: "Цена закупки",
    },
    accessorFn: (row: OfferTableItem) => row.purchasePrice,
  },
  {
    id: "purchaseAmount",
    header: "Сумма закупки",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = formatterCurrency.format(parseFloat(info.getValue() as string))
      return <div>{value}</div>
    },
    enableHiding: true,
    meta: {
      title: "Сумма закупки",
    },
    accessorFn: (row: OfferTableItem) => row.purchaseAmount,
  },
  {
    id: "delta",
    header: "Дельта",
    cell: (info: CellContext<OfferTableItem, unknown>) => {
      const value = formatterCurrency.format(parseFloat(info.getValue() as string))
      return <div>{value}</div>
    },
    enableHiding: true,
    meta: {
      title: "Дельта",
    },
    accessorFn: (row: OfferTableItem) => row.delta,
  },
]

export const defaultColumnsEquipment: ColumnDef<Equipment>[] = [
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
          onBlur={() => localEditData(row.original.id, column.id, value)}
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
          onBlur={() => localEditData(row.original.id, column.id, value)}
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
          onBlur={() => localEditData(row.original.id, column.id, value)}
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
