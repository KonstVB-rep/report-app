import { useEffect, useMemo, useState } from "react"
import {
  type CellContext,
  type ColumnDef,
  type ColumnSizingInfoState,
  type ColumnSizingState,
  getCoreRowModel,
  type Table,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ru } from "date-fns/locale"
import { CalendarIcon, X } from "lucide-react"
import { updateDate } from "@/app/dashboard/offer-constructor/store"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Input } from "@/shared/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import SelectColumns from "@/shared/custom-components/ui/SelectColumns"
import { getLS, setLS } from "@/shared/hooks/useTableState"
import { cn, formatterCurrency } from "@/shared/lib/utils"
import RowNumber from "@/widgets/deal/model/columnsDataColsTemplate/RowNumber"
import Part from "./components/Part"
import SelectedItem from "./components/SelectedItem"
import SheetEquipment from "./sheetEquipment"
import {
  type OfferTableItem,
  removePart,
  selectData,
  updateNumber,
  useOfferStoreTable,
} from "./store"

const formatter = new Intl.DateTimeFormat("ru", {
  year: "numeric",
  month: "long",
  day: "numeric",
})
const defaultColumns: ColumnDef<OfferTableItem>[] = [
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

const storageKey = "offer-table"

const colsListNotHidden = ["name", "description", "price", "count", "totalPrice"]

const OfferContent = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const data = useOfferStoreTable(selectData)
  const allRows = useMemo(() => {
    return data.parts.flatMap((p) => p.sections.flatMap((s) => s.rows))
  }, [data.parts])

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    rowNumber: false,
  })

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() =>
    getLS(`${storageKey}_columnSizing`, {}),
  )

  const [_columnSizingInfo, setColumnSizingInfo] = useState<ColumnSizingInfoState>(
    {} as ColumnSizingInfoState,
  )

  useEffect(() => {
    setLS(`${storageKey}_columnSizing`, columnSizing)
  }, [columnSizing])

  const columns = useMemo(() => defaultColumns, [])

  const table = useReactTable({
    data: allRows,
    columns,
    state: {
      columnVisibility,
      columnSizing,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onColumnSizingInfoChange: setColumnSizingInfo,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    columnResizeMode: "onChange",
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <This is a hack>
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.getState().columnSizingInfo, table.getState().columnSizing])

  console.log(data, "data")
  return (
    <div className="h-screen overflow-y-auto  p-10 relative">
      <div className="flex justify-start gap-2 mb-2">
        <SheetEquipment />
        <SelectColumns
          colsListNotHidden={colsListNotHidden}
          data={table as Table<OfferTableItem>}
        />
      </div>
      <div className="border shadow-lg  mx-auto">
        <div className="relative py-1 flex items-center justify-end">
          <img
            alt="offer"
            className="absolute inset-0 h-full w-full object-cover"
            src="/for-builder/header-bg.webp"
          />
          <textarea
            className="w-[40%] text-[10px] text-left isolate bg-transparent "
            defaultValue={`Общество с ограниченной ответственностью "ЭРТЕЛ"\nЮридический адрес:127015, г. Москва, Бумажный проезд, дом 14, строение 1,\nпомещение I, комната 6 ИНН/КПП 7709407790/771401001\nЭлектронный адрес:ertel@ertel.ru Сайт www.ertel.ru\nТел. +7(495) 644-39-76`}
            id="address"
          />

          <div className="absolute right-2 -bottom-10">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className={cn("w-full text-left font-normal border-none")}
                  variant={"outline"}
                >
                  {selectedDate ? (
                    <span>{formatter.format(selectedDate)}</span>
                  ) : (
                    <span>{formatter.format(new Date())}</span>
                  )}
                  {selectedDate ? null : <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  locale={ru}
                  mode="single"
                  onSelect={(date: Date | undefined) => {
                    setSelectedDate(date)
                    if (date) {
                      updateDate(date)
                    }
                  }}
                  required={true}
                  selected={selectedDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="py-10 flex gap-2 justify-center items-center">
          <p className="text-2xl  font-bold">Коммерческое предложение №</p>
          <Input
            className="text-2xl md:text-2xl w-1/6 "
            defaultValue={data.number}
            name="title"
            onChange={(e) => updateNumber(e.target.value)}
            type="text"
          />
        </div>
        {data.parts.map((part) => (
          <div className="relative" key={part.id}>
            <SelectedItem id={part.id} />
            <Part
              columnSizeVars={columnSizeVars}
              columnSizing={columnSizing}
              columnVisibility={columnVisibility}
              dataPart={part}
              partId={part.id}
              table={table}
            />
            {/* <OfferTable
              columnSizeVars={columnSizeVars}
              dataParts={data}
              table={table}
            /> */}
            {/* <Part secionList={part.sections} partId={part.id} /> */}
            <Button
              className="absolute top-0 -right-8 z-10 bg-red-300"
              onClick={() => removePart(part.id)}
              size="icon"
            >
              <X />
            </Button>
          </div>
        ))}
        {/* {dataParts.parts.map((part) => (
          <div key={part.id} className="relative">
            <SelectedItem id={part.id} />
            <Part secionList={part.sections} partId={part.id} />
            <Button
              onClick={() => removePart(part.id)}
              className="absolute top-0 -right-8 z-10 bg-red-300"
              size="icon"
            >
              <X />
            </Button>
          </div>
        ))} */}
      </div>
    </div>
  )
}

export default OfferContent
