import type { DealType } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import type { DealBase } from "@/entities/deal/types"
import DelButtonDeal from "@/feature/deals/ui/Modals/DelButtonDeal"
import DelButtonMultiDeals from "@/feature/deals/ui/Modals/DelButtonMultiDeals"
import DialogReassignDealConfirm from "./DialogReassignDealConfirm"

const DealsDrawer = ({ table }: { table: Table<DealBase> }) => {
  const rowSelectionKeys = Object.keys(table.getState().rowSelection)

  if (!table || rowSelectionKeys.length === 0) {
    return null
  }

  const { rows } = table.getRowModel()

  const rowsSelectionData = rows.filter((row) => {
    return rowSelectionKeys.includes(row.id)
  })

  const type = rowsSelectionData[0]?.original.type as DealType
  const dealId = rowsSelectionData[0]?.original.id
  const deals = rowsSelectionData.map((row) => {
    return {
      id: row.original.id,
      type: row.original.type as DealType,
      title: row.original.nameDeal,
    }
  })

  return (
    <>
      {rowSelectionKeys.length > 0 && (
        <div className="bg-stone-800/90 flex items-center justify-center gap-2 border absolute bottom-0 w-full h-20 rounded-t-md p-4 ">
          {rowSelectionKeys?.length === 1 && (
            <div>
              <DelButtonDeal id={dealId} isTextButton type={type} />
            </div>
          )}
          {rowSelectionKeys?.length > 1 && <DelButtonMultiDeals deals={deals} />}
          {rowSelectionKeys?.length > 0 && <DialogReassignDealConfirm deals={deals} />}
        </div>
      )}
    </>
  )
}

export default DealsDrawer
