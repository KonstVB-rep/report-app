import DialogKitTable from "@/app/dashboard/offer-constructor/components/DialogKitTable"
import {
  useDeleteEquipments,
  useDeleteFromKit,
  useUpdateEquipments,
} from "@/app/dashboard/offer-constructor/hooks/mutate"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Input } from "@/shared/components/ui/input"
import { LoaderCircle } from "@/shared/custom-components/ui/Loaders"
import RowNumber from "@/shared/lib/tanstack-table/columnsDataColsTemplate/RowNumber"
import {
  SelectColDataColumn,
  SelectColHeader,
} from "@/shared/lib/tanstack-table/columnsDataColsTemplate/SelectColHeader"
import { formatterCurrency } from "@/shared/lib/utils"
import type { CheckedState } from "@radix-ui/react-checkbox"
import type { CellContext, ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Trash, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import EditableCell from "../components/EditabledCell"
import { calculateKitTotal } from "../lib/calculateKitTotal"
import type {
  EquipmentWithQuantity,
  SerializedEquipmentItem,
  SerializedEquipmentKitItem,
} from "../lib/types"
import type { OfferTableItem } from "../store"
import {
  selectedKitId,
  selectSetSelectedKitId,
  selectUpdateLocalKit,
  useEquipmentStore,
} from "../store/localtemsStore"

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

export const defaultColumnsEquipment: ColumnDef<SerializedEquipmentItem>[] = [
  {
    ...RowNumber<SerializedEquipmentItem>(),
  },
  {
    id: "id",
    enableHiding: true,
    enableSorting: false,
    accessorFn: (row: SerializedEquipmentItem) => row.id,
    meta: {
      title: "id",
      isNotSearchable: true,
      hidden: true,
    },
  },
  {
    id: "select",
    header: ({ table }) => SelectColHeader<SerializedEquipmentItem>().label(table),
    cell: ({ row }) => {
      const selectKitId = useEquipmentStore(selectedKitId)

      if (selectKitId === row.original.id) {
        return (
          <div className="flex items-center justify-center gap-1">
            <div className="h-4 w-4 border-1 border-red-500 bg-amber-50 rounded-[4px] grid place-items-center relative">
              <X className="absolute text-red-500" size={16} />
            </div>
          </div>
        )
      }
      return (
        <div className="flex items-center justify-center gap-1">
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value: CheckedState) => {
              row.toggleSelected(!!value)
            }}
          />
        </div>
      )
    },
    accessorFn: (row) => row.id,
    enableSorting: false,
    enableHiding: false,
    minSize: 80,
    maxSize: 80,
  },
  {
    id: "name",
    size: 140,
    maxSize: 140,
    header: "Наименование",
    cell: (props) => <EditableCell {...props} tag="textarea" />,
    meta: {
      title: "Наименование",
    },
    accessorFn: (row: SerializedEquipmentItem) => row.name,
  },
  {
    id: "description",
    header: "Описание",
    cell: (props) => <EditableCell {...props} tag="textarea" />,
    meta: {
      title: "Описание",
    },
    accessorFn: (row: SerializedEquipmentItem) => row.description,
  },
  {
    id: "price",
    header: "Цена",
    cell: (props) => {
      const { row, getValue } = props

      const isKit = row.original.isKit

      return isKit ? (
        <div>{formatterCurrency.format(parseFloat(getValue() as string))}</div>
      ) : (
        <EditableCell {...props} tag="input" />
      )
    },
    enableHiding: true,
    meta: {
      title: "Цена",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: SerializedEquipmentItem) => row.price,
  },
  {
    id: "actions",
    header: "",
    size: 80,
    maxSize: 80,
    accessorFn: (row) => row.id,
    cell: ({ isEdit, setIsEdit, row, table }) => {
      const item = row.original
      const isKit = item.isKit
      const handleClick = () => {
        setIsEdit((prev: boolean) => !prev)
      }

      const selectKitId = useEquipmentStore(selectedKitId)
      const { mutate: deleleEq } = useDeleteEquipments()
      const { mutate: updateItems, isPending: isPendingUpdate } = useUpdateEquipments()

      const contentsKit = item.contents ?? []

      const handleSelectKit = () => {
        if (selectKitId) {
          selectSetSelectedKitId(null)
          return
        }
        selectSetSelectedKitId(item.id)
        table.resetRowSelection()
        toast.info("Выберите позиции из списка для добавления в комплект", {
          duration: 3000,
        })
      }

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-8 w-8 p-0" variant="ghost">
                <span className="sr-only">Открыть меню</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => deleleEq([item.id])} className="cursor-pointer">
                Удалить
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClick} className="cursor-pointer">
                {isEdit ? "Отменить изменения" : "Изменить"}
              </DropdownMenuItem>
              {isKit && (
                <DropdownMenuItem onClick={handleSelectKit} className="cursor-pointer">
                  <div className="grid gap-1">
                    <span>{selectKitId ? "Отменить добавление" : "Добавить в комплект"}</span>
                    <span className="text-xs text-gray-500">
                      {contentsKit.length === 0 && `Количетсво позиций: (${item.contents?.length})`}
                    </span>
                  </div>
                </DropdownMenuItem>
              )}
              {!isKit && (
                <DropdownMenuItem
                  onClick={() => updateItems([{ id: item.id, isKit: true }])}
                  className="cursor-pointer"
                >
                  <div className="grid gap-1">
                    <span>Сделать как комплект?</span>
                  </div>
                </DropdownMenuItem>
              )}
              {isKit && <DialogKitTable contentsKit={contentsKit} id={item.id} />}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export const defaultColumnsKitEquipment: ColumnDef<EquipmentWithQuantity>[] = [
  {
    ...RowNumber<EquipmentWithQuantity>(),
  },
  {
    id: "id",
    enableHiding: true,
    enableSorting: false,
    accessorFn: (row: EquipmentWithQuantity) => row.id,
    meta: {
      title: "id",
      isNotSearchable: true,
      hidden: true,
    },
  },
  { ...SelectColDataColumn<EquipmentWithQuantity>() },
  {
    id: "name",
    size: 140,
    maxSize: 140,
    header: "Наименование",
    cell: ({ row }) => {
      const value = row.original.name
      return value
    },
    meta: {
      title: "Наименование",
    },
    accessorFn: (row: EquipmentWithQuantity) => row.name,
  },
  {
    id: "description",
    header: "Описание",
    cell: ({ row }) => {
      const value = row.original.description
      return value
    },
    meta: {
      title: "Описание",
    },
    accessorFn: (row: EquipmentWithQuantity) => row.description,
  },
  {
    id: "price",
    header: "Цена",
    cell: ({ row }) => {
      const item = row.original

      const displayPrice = item.isKit ? calculateKitTotal(item) : Number(item.price)
      return <span>{formatterCurrency.format(parseFloat(String(displayPrice))) as string}</span>
    },
    enableHiding: true,
    meta: {
      title: "Цена",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: EquipmentWithQuantity) => row.price,
  },
  {
    id: "count",
    header: "Количество",
    cell: ({ row }) => {
      const initialValue = row.original.count

      const [value, setValue] = useState<number>(initialValue)

      return (
        <Input
          onChange={(e) => {
            if (Number.isNaN(Number(e.target.value))) {
              toast.error("Количество должно быть числом", {
                duration: 3000,
              })
              return
            }
            if (e.target.value === "") {
              setValue(0)
            }
            setValue(Number(e.target.value))
            selectUpdateLocalKit(row.original.id, "count", e.target.value)
          }}
          type="number"
          value={Number(value) as number}
        />
      )
    },
    enableHiding: true,
    meta: {
      title: "Количество",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: EquipmentWithQuantity) => row.count,
  },
]

export const defaultColumnsKitItems: ColumnDef<SerializedEquipmentKitItem>[] = [
  {
    ...RowNumber<SerializedEquipmentKitItem>(),
  },
  {
    id: "id",
    enableHiding: true,
    enableSorting: false,
    accessorFn: (row: SerializedEquipmentKitItem) => row.id,
    meta: {
      title: "id",
      isNotSearchable: true,
      hidden: true,
    },
  },
  { ...SelectColDataColumn<SerializedEquipmentKitItem>() },
  {
    id: "name",
    header: "Наименование",
    cell: ({ row }) => {
      const value = row.original.item.name
      return value
    },
    size: 140,
    maxSize: 140,
    meta: {
      title: "Наименование",
    },
    accessorFn: (row: SerializedEquipmentKitItem) => row.item.name,
  },
  {
    id: "description",
    header: "Описание",
    cell: ({ row }) => {
      const value = row.original.description
      return value
    },
    meta: {
      title: "Описание",
    },
    accessorFn: (row: SerializedEquipmentKitItem) => row.item.description,
  },
  {
    id: "price",
    header: "Цена",

    cell: ({ row }) => {
      const kitItem = row.original

      const displayPrice = kitItem.item.isKit
        ? calculateKitTotal(kitItem.item)
        : Number(kitItem.price)
      return <span>{formatterCurrency.format(parseFloat(String(displayPrice))) as string}</span>
    },
    enableHiding: true,
    meta: {
      title: "Цена",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: SerializedEquipmentKitItem) => row.price,
  },
  {
    id: "count",
    header: "Количество",
    cell: ({ row }) => {
      const initialValue = row.original.count

      const [value, setValue] = useState<number>(initialValue)

      return (
        <Input
          onChange={(e) => {
            if (Number.isNaN(Number(e.target.value))) {
              toast.error("Количество должно быть числом", {
                duration: 3000,
              })
              return
            }
            if (e.target.value === "") {
              setValue(0)
            }
            setValue(Number(e.target.value))
            selectUpdateLocalKit(row.original.id, "count", e.target.value)
          }}
          type="number"
          value={Number(value) as number}
        />
      )
    },
    enableHiding: true,
    meta: {
      title: "Количество",
    },
    size: 120,
    maxSize: 120,
    accessorFn: (row: SerializedEquipmentKitItem) => row.count,
  },
  {
    id: "actions",
    header: "",
    size: 80,
    maxSize: 80,
    accessorFn: (row) => row.id,
    cell: ({ row }) => {
      const { mutate: delFromKit, isPending } = useDeleteFromKit()

      const item = row.original

      const handleDelete = () => {
        delFromKit({ idKit: item.kitId, idsKitItem: [item.itemId] })
      }
      return (
        <div className="flex justify-center">
          <Button className="p-0" onClick={handleDelete} size="icon" variant="ghost">
            {isPending ? <LoaderCircle className="" /> : <Trash />}
          </Button>
        </div>
      )
    },
  },
]
