import type { DealType } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import type { DealBase } from "@/entities/deal/types"
import DelButtonDeal from "@/feature/deals/ui/Modals/DelButtonDeal"
import DelButtonMultiDeals from "@/feature/deals/ui/Modals/DelButtonMultiDeals"
import DrawerComponent from "@/shared/custom-components/ui/DrawerComponent"
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

  const clearSelection = () => {
    return table.resetRowSelection()
  }

  console.log(rowSelectionKeys, "rowSelectionKeys")

  return (
    <>
      {rowSelectionKeys.length > 0 && (
        <DrawerComponent positionSide="bottom-2">
          {rowSelectionKeys?.length === 1 && (
            <div>
              <DelButtonDeal
                clearData={clearSelection}
                id={dealId}
                isTextButton
                key={dealId}
                type={type}
                withCheckPermissions={false}
              />
            </div>
          )}
          {rowSelectionKeys?.length > 1 && (
            <DelButtonMultiDeals clearSelection={clearSelection} deals={deals} />
          )}
          {rowSelectionKeys?.length > 0 && <DialogReassignDealConfirm deals={deals} />}
        </DrawerComponent>
      )}
    </>
  )
}

export default DealsDrawer
