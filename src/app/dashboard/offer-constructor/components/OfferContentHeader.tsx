import type { Table } from "@tanstack/react-table"
import { Button } from "@/shared/components/ui/button"
import SelectColumns from "@/shared/custom-components/ui/SelectColumns"
import { COLS_LIST_NOT_HIDDEN, HEADER_ERTEL_IMAGE } from "../lib/constants"
import { handleOfferToExcel } from "../lib/handleOfferToExcel"
import { handleСalculationToExcel } from "../lib/handleСalculationToExcel"
import {
  addPart,
  addSection,
  type OfferTableItem,
  selectData,
  selectSelectedItemId,
  useOfferStoreTable,
} from "../store"
import SheetEquipment from "./SheetEquipment"

const OfferContentHeader = ({ table }: { table: Table<OfferTableItem> }) => {
  const selectedChapter = useOfferStoreTable(selectSelectedItemId)

  const data = useOfferStoreTable(selectData)
  const columnSizing = JSON.parse(localStorage.getItem("offer-table_columnSizing") || "{}")
  return (
    <div className="sticky top-0 justify-start mb-2 flex gap-2 p-2 bg-sidebar rounded-md z-10">
      <SheetEquipment />
      <SelectColumns
        colsListNotHidden={COLS_LIST_NOT_HIDDEN}
        data={table as Table<OfferTableItem>}
      />
      <Button onClick={() => addPart()}>Добавить раздел</Button>
      <Button onClick={() => addSection(selectedChapter)}>Добавить подраздел</Button>
      <Button onClick={() => handleOfferToExcel(data, columnSizing)}>КП в Excel</Button>
      <Button onClick={() => handleСalculationToExcel(data, HEADER_ERTEL_IMAGE)}>
        Расчет в Excel
      </Button>
    </div>
  )
}

export default OfferContentHeader
