"use client"

import { updateDate } from "@/app/dashboard/offer-constructor/store"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Input } from "@/shared/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { getLS, setLS } from "@/shared/hooks/useTableState"
import { cn } from "@/shared/lib/utils"
import {
  type ColumnSizingInfoState,
  type ColumnSizingState,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ru } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import OfferContentHeader from "./components/OfferContentHeader"
import Part from "./components/Part"
import { STORAGE_KEY } from "./lib/constants"
import { defaultColumns } from "./model/defaultColumns"
import { selectData, updateNumber, useOfferStoreTable } from "./store"

const formatter = new Intl.DateTimeFormat("ru", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

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
    getLS(`${STORAGE_KEY}_columnSizing`, {}),
  )

  const [_columnSizingInfo, setColumnSizingInfo] = useState<ColumnSizingInfoState>(
    {} as ColumnSizingInfoState,
  )

  useEffect(() => {
    setLS(`${STORAGE_KEY}_columnSizing`, columnSizing)
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

  return (
    <div className="max-h-[calc(100svh-80px)] overflow-y-auto px-3 pb-20 bg-sidebar">
      <OfferContentHeader table={table} />
      <div className="border shadow-lg mx-auto pb-20">
        <div className="relative py-1 flex items-center justify-end">
          {/* <img
            alt="offer"
            className="absolute inset-0 h-full w-full object-cover"
            src="/for-builder/header-bg.webp"
          /> */}
          {/* <textarea
            className="w-[40%] text-[10px] text-left isolate bg-transparent "
            defaultValue={`Общество с ограниченной ответственностью "ЭРТЕЛ"\nЮридический адрес:127015, г. Москва, Бумажный проезд, дом 14, строение 1,\nпомещение I, комната 6 ИНН/КПП 7709407790/771401001\nЭлектронный адрес:ertel@ertel.ru Сайт www.ertel.ru\nТел. +7(495) 644-39-76`}
            id="address"
          /> */}

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
          <p className="text-2xl font-bold">Коммерческое предложение №</p>
          <Input
            className="text-2xl md:text-2xl w-1/6 "
            defaultValue={data.number}
            name="title"
            onChange={(e) => updateNumber(e.target.value)}
            type="text"
          />
        </div>
        {data.parts.map((part) => (
          <div className="flex items-start" key={part.id}>
            <Part columnSizeVars={columnSizeVars} dataPart={part} partId={part.id} table={table} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default OfferContent
