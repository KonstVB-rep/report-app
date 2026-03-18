import type { DealType } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import type { DealUnion } from "@/entities/deal/types"
import DelButtonDeal from "@/feature/deals/ui/Modals/DelButtonDeal"
import DelButtonMultiDeals from "@/feature/deals/ui/Modals/DelButtonMultiDeals"
import DrawerComponent from "@/shared/custom-components/ui/DrawerComponent"
import DialogReassignDealConfirm from "./DialogReassignDealConfirm"

const DealsDrawer = ({ table }: { table: Table<DealUnion> }) => {
  const rowSelectionKeys = new Set<string>(Object.keys(table.getState().rowSelection))

  if (!table || rowSelectionKeys.size === 0) {
    return null
  }

  const { rows } = table.getRowModel()

  const rowsSelectionData = rows.filter((row) => {
    return rowSelectionKeys.has(row.id)
  })

  const dealId = rowsSelectionData[0]?.original.id
  const type = rowsSelectionData[0]?.original.type

  const rowSelectionSize = rowSelectionKeys.size
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
  return (
    <>
      {rowSelectionSize > 0 && (
        <DrawerComponent positionSide="bottom-2">
          {rowSelectionSize === 1 && (
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
          {rowSelectionSize > 1 && (
            <DelButtonMultiDeals clearSelection={clearSelection} deals={deals} />
          )}
          {rowSelectionSize > 0 && <DialogReassignDealConfirm deals={deals} />}
        </DrawerComponent>
      )}
    </>
  )
}

export default DealsDrawer
