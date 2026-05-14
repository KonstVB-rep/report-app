"use client"

import { type ChangeEvent, memo, useEffect, useState } from "react"
import type { Cell, Row, Table } from "@tanstack/react-table"
import { ImagePlus, Trash2, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn, formatterCurrency } from "@/shared/lib/utils"
import { type OfferTableItem, selectSectionById, updateRow, useOfferStoreTable } from "../store"

type OfferTablepProps = {
  dataTable: OfferTableItem[]
  table: Table<OfferTableItem>
  partId: string
  sectionId: string
  removeRow: (rowId: string) => void
  sectionName: string
}

import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import ButtonDndGrab from "./ButtonDndGrab"

const SortableTableRow = ({
  row,
  currentId,
  removeRow,
}: {
  row: Row<OfferTableItem>
  currentId: string
  removeRow: (id: string) => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: currentId,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 30 : "auto",
    backgroundColor: isDragging ? "var(--muted)" : "transparent",
  }

  return (
    <div
      className="flex relative items-center border-b border-border transition-colors"
      ref={setNodeRef}
      style={style}
    >
      <ButtonDndGrab dragHandleProps={{ attributes, listeners }} />

      {row.getVisibleCells().map((cell) => (
        <CellOfferTable cell={cell} key={cell.id} />
      ))}

      <Button
        className="absolute top-0 -right-10"
        onClick={() => removeRow(row.original.rowId)}
        size="icon"
        title="Удалить строку"
        variant="outline"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  )
}

const TableBodyOffer = ({
  table,
  dataTable,
  removeRow,
}: {
  table: Table<OfferTableItem>
  dataTable: OfferTableItem[]
  removeRow: (rowId: string) => void
}) => {
  const rows = table.getRowModel().rows.filter((row) => {
    return dataTable.some((d) => d.rowId === row.original.rowId)
  })

  return (
    <div className="tbody grid w-full">
      {rows.map((row) => (
        <SortableTableRow
          currentId={row.original.rowId}
          key={row.original.rowId} // Стабильный UUID ключ для React
          removeRow={removeRow}
          row={row}
        />
      ))}
    </div>
  )
}

const TableFooterOffer = ({
  table,
  sectionName,
  sectionId,
  partId,
}: {
  table: Table<OfferTableItem>
  sectionName: string
  sectionId: string
  partId: string
}) => {
  const section = useOfferStoreTable(selectSectionById(partId, sectionId))

  return (
    <div className="tfooter flex">
      {table.getAllColumns().map((column) => {
        if (column.columnDef.meta?.hidden || !column.getIsVisible()) return null
        return (
          <div
            className="p-2 td min-w-12 min-h-[57px] relative flex items-center"
            key={column.id}
            style={{
              width: `calc(var(--col-${column.id}-size) * 1px)`,
            }}
          >
            <span className="text-end block w-full relative">
              {column.id === "totalPrice" && (
                <>
                  <span className="text-nowrap absolute right-[110%]">ИТОГО {sectionName}:</span>
                  {formatterCurrency.format(Number(section?.totalPrice))}
                </>
              )}
              {column.id === "purchaseAmount" &&
                formatterCurrency.format(Number(section?.totalPurchase))}
              {column.id === "delta" && formatterCurrency.format(Number(section?.totalDelta))}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export const CellOfferTable = memo(({ cell }: { cell: Cell<OfferTableItem, unknown> }) => {
  const initialValue = (cell.getValue() as string) ?? ""
  const [value, setValue] = useState<string>(initialValue)
  const [isEditing, setIsEditing] = useState(false) // Состояние для переключения режима

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handlePersist = () => {
    setIsEditing(false)
    if (value !== initialValue) {
      // Убираем случайные пробелы, если пользователь их ввел вручную
      const cleanValue = value.replace(/\s/g, "").replace(",", ".")
      const updateItem = {
        ...cell.row.original,
        [cell.column.id]: cleanValue,
      }
      updateRow(updateItem)
    }
  }

  const isPriceCol = ["price", "purchasePrice", "totalPrice", "purchaseAmount", "delta"].includes(
    cell.column.id,
  )

  const isReadOnlyPrice = ["totalPrice", "purchaseAmount", "delta"].includes(cell.column.id)

  return (
    <div
      className={cn(
        "p-2 flex items-start justify-center border-r last:border-r-0 overflow-hidden text-sm min-h-[57px]",
        cell.column.id === "description" && "flex-1",
      )}
      key={cell.id}
      style={{ width: `calc(var(--col-${cell.column.id}-size) * 1px)` }}
    >
      <div className="grid gap-2 justify-items-center w-full">
        {isPriceCol ? (
          isReadOnlyPrice || !isEditing ? (
            <Button
              className="text-end w-full py-2 px-1 min-h-[37px] flex items-center justify-end cursor-text"
              onClick={() => !isReadOnlyPrice && setIsEditing(true)}
            >
              {formatterCurrency.format(parseFloat(value || "0"))}
            </Button>
          ) : (
            <input
              className="text-end w-full shadow-none border-none px-1 py-2 bg-transparent outline-none ring-1 ring-blue-500 rounded-sm"
              onBlur={handlePersist}
              onChange={(e) => setValue(e.target.value)}
              type="text"
              value={value}
            />
          )
        ) : cell.column.id === "name" || cell.column.id === "description" ? (
          <Textarea
            className="text-xs"
            onBlur={handlePersist}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        ) : (
          <input
            className="text-end w-full shadow-none border-none px-1 py-2 bg-transparent outline-none"
            onBlur={handlePersist}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        )}

        {cell.column.id === "name" && <Cell row={cell.row.original} />}
      </div>
    </div>
  )
})

const Cell = ({ row }: { row: OfferTableItem }) => {
  const [imagePreview, setImagePreview] = useState<string | null>("")
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.type === "image/webp") {
        alert("Формат WebP не поддерживается в PDF. Используйте PNG или JPG.")
        return
      }
      const reader = new FileReader()
      const image = URL.createObjectURL(file)

      reader.onloadend = () => {
        const base64String = reader.result as string

        updateRow({ ...row, image: base64String })
      }
      reader.readAsDataURL(file)

      setImagePreview(image)
    }
  }
  return (
    <div className="mt-2 flex flex-col gap-2">
      {imagePreview && (
        <div className="flex gap-1 items-start">
          <Image
            alt="Preview"
            className="h-24 w-24 object-cover rounded-md border ratio-square border-gray-400 m-auto"
            height={96}
            src={row.image || imagePreview}
            width={96}
          />

          <Button onClick={() => setImagePreview("")} size="icon" variant="destructive">
            <X />
          </Button>
        </div>
      )}

      <Label className="cursor-pointer flex items-center gap-2">
        <ImagePlus size={20} />
        <span>{imagePreview ? "Изменить фото" : "Добавить фото"}</span>

        <Input
          accept="image/*"
          className="hidden"
          name="name"
          onChange={handleFileChange}
          type="file"
        />
      </Label>
    </div>
  )
}

const OfferTable = ({
  dataTable,
  table,
  partId,
  sectionId,
  removeRow,
  sectionName,
}: OfferTablepProps) => {
  const hasRows = dataTable.length > 0
  return (
    <div className="relative">
      <SortableContext items={dataTable.map((r) => r.rowId)} strategy={verticalListSortingStrategy}>
        <TableBodyOffer dataTable={dataTable} removeRow={removeRow} table={table} />
      </SortableContext>

      {hasRows && (
        <TableFooterOffer
          partId={partId}
          sectionId={sectionId}
          sectionName={sectionName}
          table={table}
        />
      )}
    </div>
  )
}

export default OfferTable
