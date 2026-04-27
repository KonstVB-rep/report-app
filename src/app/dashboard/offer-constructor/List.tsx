import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { cn } from "@/shared/lib/utils"

import { Calendar } from "@/shared/components/ui/calendar"
import { Textarea } from "@/shared/components/ui/textarea"
import { getLS, setLS } from "@/shared/hooks/useTableState"
import {
  ColumnDef,
  ColumnSizingInfoState,
  ColumnSizingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ru } from "date-fns/locale/ru"
import { CalendarIcon, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import InputTitle from "./InputTitle"
import SectionOffer from "./SectionOffer"
import SelectedItem from "./SelectedItem"
import {
  DataSection,
  removePart,
  removeSection,
  selectPart,
  selectParts,
  updateDate,
  updateOfferNumber,
  updatePartTitle,
  useOfferStore,
} from "./store"

let formatter = new Intl.DateTimeFormat("ru", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

const List = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const dataParts = useOfferStore(selectParts)
  // const encodedData = encodeURIComponent(JSON.stringify(dataParts));
  // const isReadOnly = useOfferStore(selectIsReadonly);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  return (
    <div className="h-screen overflow-y-auto  p-10 relative">
      <div className="border shadow-lg  mx-auto">
        <div className="relative py-1 flex items-center justify-end">
          <img
            src="/for-builder/header-bg.webp"
            alt="offer"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <textarea
            id="address"
            className="w-[40%] text-[10px] text-left isolate bg-transparent "
            defaultValue={`Общество с ограниченной ответственностью "ЭРТЕЛ"\nЮридический адрес:127015, г. Москва, Бумажный проезд, дом 14, строение 1,\nпомещение I, комната 6 ИНН/КПП 7709407790/771401001\nЭлектронный адрес:ertel@ertel.ru Сайт www.ertel.ru\nТел. +7(495) 644-39-76`}
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
            name="title"
            type="text"
            className="text-2xl md:text-2xl w-1/6 "
            defaultValue={dataParts.number}
            onChange={(e) => updateOfferNumber(e.target.value)}
          />
        </div>
        {dataParts.parts.map((part) => (
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
        ))}
      </div>
    </div>
  )
}

export default List
export type TableOffer = {
  id: string
  name: string
  description: string
  price: number
  count: number
  totalPrice: number
}

const defaultColumns: ColumnDef<TableOffer>[] = [
  {
    id: "name",
    header: "Наименование",
    accessorKey: "name",
    cell: ({ row, updateData }) => {
      const onBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        updateData(e.target.value)
      }
      return (
        <Textarea name={row.id} className="" defaultValue={row.original.name} onBlur={onBlur} />
      )
    },
  },
  {
    id: "description",
    header: "Описание",
    accessorKey: "description",
    cell: ({ row, updateData }) => {
      const onBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        updateData(e.target.value)
      }
      return (
        <Textarea
          name={row.id}
          className=""
          defaultValue={row.original.description}
          onBlur={onBlur}
        />
      )
    },
  },
  {
    id: "price",
    header: "Цена",
    accessorKey: "price",
    cell: ({ row, updateData }) => {
      const initialValue = row.original.price
      const [value, setValue] = useState(initialValue)

      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      const onBlur = () => {
        updateData(Number(value))
      }

      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value)
            if (!Number.isNaN(val)) {
              setValue(val)
            } else {
              setValue(0)
            }
            if (e.target.value === "") {
              setValue(0)
            }
          }}
          onBlur={onBlur}
          className="text-end"
        />
      )
    },
  },
  {
    id: "count",
    header: "Количество",
    accessorKey: "count",
    cell: ({ row, updateData }) => {
      const initialValue = row.original.count
      const [value, setValue] = useState(initialValue)

      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      const onBlur = () => {
        updateData(Number(value))
      }

      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value)
            if (!Number.isNaN(val)) {
              setValue(val)
            } else {
              setValue(0)
            }
            if (e.target.value === "") {
              setValue(0)
            }
          }}
          onBlur={onBlur}
          className="text-end"
        />
      )
    },
  },
  {
    id: "totalPrice",
    header: "Итого",
    accessorKey: "totalPrice",
    cell: ({ row }) => {
      return <div className="font-bold py-1 px-3 text-end">{row.original.totalPrice || 0}</div>
    },
  },
]

const storageKey = "offer_global_column_sizing"
const Part = ({ secionList, partId }: { secionList: DataSection[]; partId: string }) => {
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => getLS(storageKey, {}))

  useEffect(() => {
    setLS(storageKey, columnSizing)
  }, [columnSizing, storageKey])
  const [columnSizingInfo, setColumnSizingInfo] = useState<ColumnSizingInfoState>(
    {} as ColumnSizingInfoState,
  )

  const columns = useMemo(() => defaultColumns, [])

  const table = useReactTable({
    data: [],
    columns,
    defaultColumn: {
      size: 100,
      minSize: 50,
      maxSize: 500,
    },
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    onColumnSizingChange: setColumnSizing,
    onColumnSizingInfoChange: setColumnSizingInfo,
    state: {
      columnSizing,
      columnSizingInfo,
    },
  })

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
  const part = selectPart(partId)

  return (
    <>
      <div className="flex gap-2 justify-start items-center border-t-[4px] border-t-blue-900 border-b-[2px] border-b-black">
        <p className="text-xl font-bold">Раздел</p>
        <InputTitle
          defaultTitle={part?.name || ""}
          updateTitleAction={(title) => updatePartTitle(partId, title)}
          className="text-xl! h-10!"
        />
      </div>

      <div
        className="w-full! border-separate border-spacing-0"
        style={{ ...columnSizeVars, width: table.getTotalSize() }}
      >
        <div className="sticky top-0 z-10 bg-whit border-none shadow-none">
          {table.getHeaderGroups().map((headerGroup) => (
            <div className="flex w-fit border-none shadow-none" key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <div
                  key={header.id}
                  className={cn("p-2! border-none shadow-none relative h-auto font-bold", {
                    "rounded-tr-sm": index === headerGroup.headers.length - 1,
                    "rounded-tl-sm": index === 0,
                  })}
                  style={{
                    width: `calc(var(--header-${header.id}-size) * 1px)`,
                    flex: "0 0 auto",
                    willChange: "width",
                  }}
                >
                  {!header.isPlaceholder && (
                    <span
                      className={cn(
                        "grid content-between justify-items-center gap-1 h-full text-primary px-1",
                      )}
                    >
                      <span className="text-md font-bold first-letter:capitalize text-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {header.column.getCanResize() && (
                        <span
                          onDoubleClick={() => header.column.resetSize()}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={cn("resizer", header.column.getIsResizing() && "isResizing")}
                        />
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {secionList.map((section) => (
          <div className="relative" key={section.id}>
            <SelectedItem id={section.id} />
            <SectionOffer table={table} sectionData={section} partId={partId} />
            <Button
              onClick={() => removeSection(partId, section.id)}
              className="absolute top-0 -right-8 z-10 bg-red-300"
              size="icon"
            >
              <X />
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}
