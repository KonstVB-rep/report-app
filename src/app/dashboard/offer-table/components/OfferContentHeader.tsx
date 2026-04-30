import SelectColumns from "@/shared/custom-components/ui/SelectColumns"

import { Button } from "@/shared/components/ui/button"
import { Table } from "@tanstack/react-table"
import { COLS_LIST_NOT_HIDDEN, HEADER_ERTEL_IMAGE } from "../lib/constants"

import SheetEquipment from "../sheetEquipment"
import {
  OfferTableItem,
  addPart,
  addSection,
  selectData,
  selectSelectedItemId,
  useOfferStoreTable,
} from "../store"
import { exportOfferToExcel } from "../lib/exportToExcel"
import { exportcСalculationToExcel } from "../lib/exportcСalculationToExcel"

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
      <Button onClick={() => exportOfferToExcel(data, columnSizing)}>КП в Excel</Button>
      <Button onClick={() => exportcСalculationToExcel(data, HEADER_ERTEL_IMAGE)}>
        Расчет в Excel
      </Button>
    </div>
  )
}

export default OfferContentHeader
