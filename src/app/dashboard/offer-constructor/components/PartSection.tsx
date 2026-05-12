import { useCallback } from "react"
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
import InputTitle from "./InputTitle"
import OfferTable from "./OfferTable"
import SelectedItem from "./SelectedItem"

const PartSection = ({
  partId,
  section,
  table,
}: {
  partId: string
  section: DataSection
  table: Table<OfferTableItem>
}) => {
  const handleRemoveRow = useCallback(
    (rowId: string) => {
      removeRow(partId, section.id, rowId)
    },
    [partId, section.id],
  )
  return (
    <div>
      <div className="relative">
        <InputTitle
          className="text-lg! min-h-12! bg-[#0070C0] p-2 my-2 flex-1 pr-20"
          defaultTitle={section.name || ""}
          updateTitleAction={(title) => updateSectionTitle(partId, section.id, title)}
        />
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
