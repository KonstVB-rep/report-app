import { useCallback } from "react"
import type { ColumnSizingState, Table, VisibilityState } from "@tanstack/react-table"
import OfferTable from "@/app/dashboard/offer-table/components/OfferTable"
import { type DataSection, type OfferTableItem, removeRow } from "@/app/dashboard/offer-table/store"

const PartSection = ({
  partId,
  section,
  table,
  columnSizing,
  columnVisibility,
}: {
  partId: string
  section: DataSection
  table: Table<OfferTableItem>
  columnSizing: ColumnSizingState
  columnVisibility: VisibilityState
}) => {
  const handleRemoveRow = useCallback(
    (rowId: string) => {
      removeRow(partId, section.id, rowId)
    },
    [partId, section.id],
  )
  return (
    <div>
      <div className="bg-blue-950 p-2 my-2">{section.name}</div>
      <OfferTable
        columnSizing={columnSizing}
        columnVisibility={columnVisibility}
        dataTable={section.rows}
        removeRow={handleRemoveRow}
        table={table}
      />
    </div>
  )
}

export default PartSection
