import type { Table } from "@tanstack/react-table"
import { DropDowmExcelExport } from "@/feature/Sidebar/ui/DropDowmExcelExport"
import { Button } from "@/shared/components/ui/button"
import SelectColumns from "@/shared/custom-components/ui/SelectColumns"
import { COLS_LIST_NOT_HIDDEN } from "../lib/constants"
import {
  addPart,
  addSection,
  type OfferTableItem,
  selectSelectedItemId,
  useOfferStoreTable,
} from "../store"
import SaveOfferTemplateDialog from "./SaveOfferTemplateDialog"
import SheetEquipment from "./SheetEquipment"

const OfferContentHeader = ({ table }: { table: Table<OfferTableItem> }) => {
  const selectedChapter = useOfferStoreTable(selectSelectedItemId)

  return (
    <div className="sticky top-0 justify-between mb-2 flex gap-2 p-2 bg-sidebar rounded-md z-10">
      <div className="flex justify-start gap-1">
        <SheetEquipment />
        <SelectColumns
          colsListNotHidden={COLS_LIST_NOT_HIDDEN}
          data={table as Table<OfferTableItem>}
        />
        <Button onClick={() => addPart()}>Добавить раздел</Button>
        <Button onClick={() => addSection(selectedChapter)}>Добавить подраздел</Button>
        <DropDowmExcelExport />
      </div>
      <SaveOfferTemplateDialog />
    </div>
  )
}

export default OfferContentHeader
