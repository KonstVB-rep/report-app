"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  pointerWithin,
} from "@dnd-kit/core"
import { snapCenterToCursor } from "@dnd-kit/modifiers"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  type ColumnSizingInfoState,
  type ColumnSizingState,
  getCoreRowModel,
  type Table,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { ru } from "date-fns/locale"
import { CalendarIcon, GripVertical } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Calendar } from "@/shared/components/ui/calendar"
import { Input } from "@/shared/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { getLS, setLS } from "@/shared/hooks/useTableState"
import { cn } from "@/shared/lib/utils"
import { STORAGE_KEY } from "../lib/constants"
import { defaultColumns } from "../model/defaultColumns"
import {
  type DataPart,
  type DataSection,
  type OfferTableItem,
  selectData,
  updateDate,
  updateNumber,
  useOfferStoreTable,
} from "../store"
import OfferContentHeader from "./OfferContentHeader"
import Part from "./Part"
import SelectOfferTemplate from "./SelectOfferTemplate"
import SelectVat from "./SelectVat"

export const formatter = new Intl.DateTimeFormat("ru", {
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
    getRowId: (row) => row.id,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    onColumnSizingInfoChange: setColumnSizingInfo,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: 50,
      maxSize: 800,
    },
    columnResizeMode: "onChange",
  })

  const containerRef = useRef<HTMLDivElement>(null)

  const movePart = useOfferStoreTable((state) => state.movePart)
  const moveSection = useOfferStoreTable((state) => state.moveSection)

  const moveRow = useOfferStoreTable((state) => state.moveRow) // Забираем новый экшен

  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<"part" | "section" | "row" | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id)
    setActiveId(id)

    // Определяем тип элемента, который схватили
    if (data.parts.some((p) => p.id === id)) {
      setActiveType("part")
    } else {
      // Ищем среди секций
      let isSection = false
      for (const p of data.parts) {
        if (p.sections.some((s) => s.id === id)) {
          isSection = true
          break
        }
      }
      setActiveType(isSection ? "section" : "row")
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setActiveType(null)

    if (!over || active.id === over.id) return

    const activeStrId = String(active.id)
    const overStrId = String(over.id)

    if (activeType === "part") {
      movePart(activeStrId, overStrId)
    } else if (activeType === "section") {
      moveSection(activeStrId, overStrId)
    } else if (activeType === "row") {
      moveRow(activeStrId, overStrId)
    }

    table.resetRowSelection()
  }

  const findActiveSection = (sectionId: string): DataSection | null => {
    for (const part of data.parts) {
      const foundSection = part.sections.find((s) => s.id === sectionId)
      if (foundSection) return foundSection
    }
    return null
  }

  const findActiveRow = (rowId: string): OfferTableItem | null => {
    for (const part of data.parts) {
      for (const sec of part.sections) {
        const r = sec.rows.find((row) => row.rowId === rowId)
        if (r) return r
      }
    }
    return null
  }

  const activeRowData = activeType === "row" && activeId ? findActiveRow(activeId) : null
  const activeSectionData =
    activeType === "section" && activeId ? findActiveSection(activeId) : null

  // biome-ignore lint/correctness/useExhaustiveDependencies: <This is a hack>
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.getState().columnSizingInfo, table.getState().columnSizing])

  return (
    <div className="max-h-[calc(100svh-80px)] min-h-[calc(100svh-80px)] overflow-y-auto px-3 pb-20 bg-stone-800/20 backdrop-blur-sm ">
      <OfferContentHeader table={table} />
      <div className="border shadow-lg mx-auto pb-20">
        <div className="relative p-1 flex items-center justify-between">
          <SelectVat />
          <div className="relative py-1 flex items-center justify-end px-1">
            <SelectOfferTemplate />
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
        <div className="relative w-full" ref={containerRef}>
          <DndContext
            collisionDetection={pointerWithin}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart} // Подключаем старт
          >
            <SortableContext
              items={data.parts.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {data.parts.map((part, partIndex) => (
                <SortablePartItem
                  columnSizeVars={columnSizeVars}
                  key={part.id} // Стабильный ключ на верхнем уровне
                  part={part}
                  partIndex={partIndex}
                  table={table}
                />
              ))}
            </SortableContext>
            <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
              {activeSectionData ? (
                <div className="w-[100px] pointer-events-none select-none z-[9999] transform translate-x-1/2">
                  <div className="w-full bg-background border border-primary/40 rounded-md p-2 shadow-2xl scale-[1.02] opacity-95">
                    <div className="flex gap-2 items-center text-base min-h-10 bg-[#0070C0] p-2 text-white font-medium rounded-sm">
                      <span className="shrink-0 text-xs bg-white/20 px-1.5 py-0.5 rounded">
                        Перенос
                      </span>
                      <span className="truncate flex-1 text-sm">
                        {activeSectionData.name || "Подраздел"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeRowData && (
                <div className="w-[100px] pointer-events-none select-none z-[9999] -ml-[6px]">
                  <div className="flex items-center gap-3 bg-background border border-primary/30 rounded-md p-3 shadow-2xl opacity-95 scale-[1.01]">
                    <div className="text-muted-foreground">
                      <GripVertical size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {activeRowData.name || "Пустая строка оборудования"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activeRowData.description || "Без описания"}
                      </p>
                    </div>
                    <div className="text-sm font-medium whitespace-nowrap px-2 py-0.5 bg-muted rounded">
                      {activeRowData.count || 1} шт.
                    </div>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default OfferContent

const SortablePartItem = ({
  part,
  partIndex,
  columnSizeVars,
  table,
}: {
  part: DataPart
  partIndex: number
  columnSizeVars: { [key: string]: number }
  table: Table<OfferTableItem>
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } =
    useSortable({ id: part.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  }

  return (
    <div
      className={cn("flex relative items-center border-b border-border transition-colors", {
        "border-dashed border-primary/60 bg-primary/5 shadow-inner scale-[0.99]":
          isOver && !isDragging,
      })}
      ref={setNodeRef}
      style={style}
    >
      <Part
        columnSizeVars={columnSizeVars}
        dataPart={part}
        dragHandleProps={{ attributes, listeners }}
        partId={part.id}
        partIndex={partIndex}
        table={table}
      />
    </div>
  )
}
