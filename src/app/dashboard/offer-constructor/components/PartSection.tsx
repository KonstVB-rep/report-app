import { useCallback } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Table } from "@tanstack/react-table"
import { PlusCircle, X } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  addRow,
  type DataSection,
  type OfferTableItem,
  removeRow,
  removeSection,
  updateSectionTitle,
} from "../store"
import ButtonDndGrab from "./ButtonDndGrab"
import InputTitle from "./InputTitle"
import OfferTable from "./OfferTable"
import SelectedItem from "./SelectedItem"

type PartSectionProps = {
  partId: string
  section: DataSection
  table: Table<OfferTableItem>
  partIndex: number
  sectionIndex: number
}

const PartSection = ({ partId, section, table, partIndex, sectionIndex }: PartSectionProps) => {
  const handleRemoveRow = useCallback(
    (rowId: string) => {
      removeRow(partId, section.id, rowId)
    },
    [partId, section.id],
  )

  const sectionNumber = sectionIndex + 1
  const partNumber = partIndex + 1
  const order = `${partNumber}.${sectionNumber}. `

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } =
    useSortable({ id: section.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 40 : "auto", // Чтобы перетаскиваемый подраздел был выше остальных
  }

  const title = section.name || ""

  return (
    <div className="w-full" ref={setNodeRef} style={style}>
      <div
        className={`relative flex items-center ${isOver && !isDragging ? "ring-2 ring-dashed ring-[#0070C0] bg-blue-50/40 rounded-lg p-1" : ""}`}
      >
        <ButtonDndGrab dragHandleProps={{ attributes, listeners }} />

        <div className="flex gap-2 items-center text-lg min-h-12! bg-[#0070C0] p-2 my-2 flex-1 pr-20">
          <span className="text-white font-medium">{order}</span>
          <InputTitle
            className="text-lg!"
            defaultTitle={title}
            updateTitleAction={(newTitle) =>
              updateSectionTitle(partId, section.id, newTitle, order)
            }
          />
        </div>

        <SelectedItem
          className="absolute top-1/2 transform -translate-y-1/2 right-14"
          partId={partId}
          sectionId={section.id}
        />
        <Button
          className="absolute top-1/2 transform -translate-y-1/2 right-2"
          onClick={() => removeSection(partId, section.id)}
          size="icon"
          variant="destructive"
        >
          <X />
        </Button>
        <Button
          className="absolute top-1/2 transform -translate-y-1/2 -right-10"
          onClick={() => addRow(partId, section.id)}
          size="icon"
          title="Добавить строку"
          variant="outline"
        >
          <PlusCircle />
        </Button>
      </div>

      <OfferTable
        dataTable={section.rows}
        partId={partId}
        removeRow={handleRemoveRow}
        sectionId={section.id}
        sectionName={section.name}
        table={table}
      />
    </div>
  )
}

export default PartSection
