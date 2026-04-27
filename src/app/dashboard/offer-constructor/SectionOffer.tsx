import { Button } from "@/shared/components/ui/button"
import { flexRender, Table } from "@tanstack/react-table"
import { ImagePlus, X } from "lucide-react"
import { ChangeEvent, memo, useState } from "react"
import InputTitle from "./InputTitle"
import { TableOffer } from "./List"
import {
  addRow,
  DataRow,
  DataSection,
  DataSubSection,
  removeRow,
  updateRow,
  updateSubSectionTitle,
} from "./store"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"

const SectionOffer = ({
  table,
  sectionData,
  partId,
}: {
  table: Table<TableOffer>
  sectionData: DataSection
  partId: string
}) => {
  return (
    <>
      <section className="overflow-hidden">
        <div>
          {sectionData.subSections.map((sub) => (
            <SubSection
              key={sub.id}
              data={sub}
              partId={partId}
              sectionId={sectionData.id}
              table={table}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default SectionOffer

const SubSection = ({
  table,
  data,
  partId,
  sectionId,
}: {
  table: Table<TableOffer>
  data: DataSubSection
  partId: string
  sectionId: string
}) => {
  return (
    <>
      <div className="w-full">
        <InputTitle
          defaultTitle={data.name}
          updateTitleAction={(title) => updateSubSectionTitle(partId, sectionId, data.id, title)}
          className="bg-blue-900 text-white"
        />
      </div>
      <TableBody
        table={table}
        rows={data.rows}
        subSectionId={data.id}
        sectionId={sectionId}
        partId={partId}
      />
    </>
  )
}

const items = [
  {
    id: 1,
    title: "Терминал Park Style ASP-N",
    description: "Описание",
    price: 24000,
    count: 0,
    image: "C:\Users\ro3en\OneDrive\Рабочий стол\ros-parking\фото\Контроллер управления К-09.png",
  },
  {
    id: 2,
    title: "Терминал Park Style ASP-N",
    description: "Описание",
    price: 284000,
    count: 0,
    image: "C:\Users\ro3en\OneDrive\Рабочий стол\ros-parking\фото\Контроллер управления К-09.png",
  },
  {
    id: 3,
    title: "Терминал Park Style ASP-N",
    description: "Описание",
    price: 127000,
    count: 0,
    image: "C:\Users\ro3en\OneDrive\Рабочий стол\ros-parking\фото\Контроллер управления К-09.png",
  },
  {
    id: 4,
    title: "Терминал Park Style ASP-N",
    description: "Описание",
    price: 350000,
    count: 0,
    image: "C:\Users\ro3en\OneDrive\Рабочий стол\ros-parking\фото\Контроллер управления К-09.png",
  },
]

function TableBody({
  table,
  partId,
  sectionId,
  subSectionId,
  rows,
}: {
  table: Table<TableOffer>
  rows: DataRow[]
  partId: string
  sectionId: string
  subSectionId: string
}) {
  return (
    <div className="sub-section">
      <div className="tbody flex flex-col">
        {rows.map((row: DataRow, rowIndex: number) => (
          <div key={row.id} className="tr-offer flex border-b transition-colors relative">
            <Button
              size="icon"
              className="absolute top-0 right-0 bg-red-500"
              onClick={() => removeRow(partId, sectionId, subSectionId, row.id)}
            >
              <X />
            </Button>
            {table.getVisibleFlatColumns().map((column: any) => (
              <div
                key={column.id}
                className="td-offer p-1"
                style={{ width: `calc(var(--col-${column.id}-size) * 1px)` }}
              >
                {flexRender(column.columnDef.cell, {
                  row: { original: row, index: rowIndex },
                  column,
                  table,
                  // Прокидываем кастомный хэндлер обновления в meta или напрямую
                  updateData: (value: string) =>
                    updateRow(partId, sectionId, subSectionId, row.id, column.id, value),
                })}
                {column.id === "name" && (
                  <Cell
                    partId={partId}
                    sectionId={sectionId}
                    subId={subSectionId}
                    rowId={row.id}
                    image={row.image}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Button onClick={() => addRow(partId, sectionId, subSectionId)}>Добавить строку</Button>
    </div>
  )
}

const Cell = ({
  partId,
  sectionId,
  subId,
  rowId,
  image,
}: {
  partId: string
  sectionId: string
  subId: string
  rowId: string
  image: string | null
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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

        updateRow(partId, sectionId, subId, rowId, "image", base64String)
      }
      reader.readAsDataURL(file)

      setImagePreview(image)
    }
  }
  return (
    <div className="mt-2 flex flex-col gap-2">
      {imagePreview && (
        <img
          src={image || imagePreview}
          alt="Preview"
          className=" h-20 object-cover rounded-md border w-full ratio-square border-gray-400"
        />
      )}

      {/* <SelectComponent
        options={[
          ["1", "Терминал Park Style ASP-N"],
          ["2", "Терминал Park Style ASP-N"],
          ["3", "Терминал Park Style ASP-N"],
          ["4", "Терминал Park Style ASP-N"],
        ]}
        placeholder=""
      /> */}

      {/* <SelectGroups /> */}

      <Label className="cursor-pointer text-black flex items-center gap-2">
        <ImagePlus size={20} />
        <span>{imagePreview ? "Изменить фото" : "Добавить фото"}</span>
        <Input
          name="name"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </Label>
    </div>
  )
}

export const MemoizedTableBody = memo(TableBody, (prev, next) => {
  // 1. Сравниваем строки конкретного подраздела.
  // Если в Zustand изменилась цена в ЭТОМ подразделе, ссылка на rows станет новой.
  const isRowsSame = prev.rows === next.rows

  // 2. Проверяем, идет ли ресайз В ЭТОМ РАЗДЕЛЕ (Section).
  // Мы берем состояние из объекта table, который общий для всего раздела.
  const isResizing = !!next.table.getState().columnSizingInfo.isResizingColumn

  // Если данные (строки) изменились — перерисовываем (возвращаем false)
  if (!isRowsSame) return false

  // Если данные те же, но идет ресайз — блокируем рендер (возвращаем true).
  // Благодаря этому работают только CSS-переменные ширины, и всё "летает".
  if (isResizing) return true

  // В остальных случаях (например, если изменился номер КП где-то наверху)
  // тоже не перерисовываем, если сами строки не тронуты.
  return true
})

export function SelectGroups() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-48 bg-white text-black">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.id} value={item.title} className="bg-white text-black">
            {item.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
