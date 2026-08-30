import { useMemo } from "react"
import type { DealType } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import type { DealUnion } from "@/entities/deal/types"
import DelButtonDeal from "@/feature/deals/ui/Modals/DelButtonDeal"
import DelButtonMultiDeals from "@/feature/deals/ui/Modals/DelButtonMultiDeals"
import DrawerComponent from "@/shared/custom-components/ui/DrawerComponent"
import DialogReassignDealConfirm from "./DialogReassignDealConfirm"

const DealsDrawer = ({ table }: { table: Table<DealUnion> }) => {
  const rowSelection = table.getState().rowSelection

  const rowSelectionKeys = useMemo(() => new Set<string>(Object.keys(rowSelection)), [rowSelection])

  if (!table || rowSelectionKeys.size === 0) {
    return null
  }

  const { rows } = table.getRowModel()

  const rowsSelectionData = rows.filter((row) => {
    return rowSelectionKeys.has(row.id)
  })

  const firstSelectedRow = rowsSelectionData[0]
  const dealId = firstSelectedRow?.original.id
  const type = firstSelectedRow?.original.type as DealType | undefined

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

  if (rowSelectionSize === 0) {
    return null
  }
  return (
    <DrawerComponent positionSide="bottom-2">
      {rowSelectionSize === 1 && dealId && type && (
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
      <DialogReassignDealConfirm deals={deals} />
    </DrawerComponent>
  )
}

export default DealsDrawer
