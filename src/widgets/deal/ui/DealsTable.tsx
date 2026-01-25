import type React from "react"
import { useCallback } from "react"
import type { DealType } from "@prisma/client"
import type { ColumnDef, Row } from "@tanstack/react-table"
import dynamic from "next/dynamic"
import z from "zod"
import { UnionDealTypeParams } from "@/entities/deal/lib/constants"
import type { DealBase } from "@/entities/deal/types"
import AdditionalContacts from "@/feature/deals/ui/AdditionalContacts"
import AddNewDeal from "@/feature/deals/ui/Modals/AddNewDeal"
import {
  type TableContextType,
  TableProvider,
} from "@/shared/custom-components/ui/Table/context/TableContext"
import TableComponent from "@/shared/custom-components/ui/Table/TableComponent"
import { useTypedParams } from "@/shared/hooks/useTypedParams"
import DataTable from "@/widgets/DataTable/ui/DataTable"
import { useParams } from "next/navigation"

const EditDealContextMenu = dynamic(() => import("@/feature/deals/ui/Modals/EditDealContextMenu"), {
  ssr: false,
})

const DelDealContextMenu = dynamic(() => import("@/feature/deals/ui/Modals/DelDealContextMenu"), {
  ssr: false,
})

const ModalDealInfo = dynamic(() => import("@/feature/deals/ui/Modals/ModalDealInfo"), {
  ssr: false,
})

interface DealsTableProps<T extends DealBase> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  hasEditDeleteActions?: boolean
  hiddenCols?: Partial<Record<Extract<NonNullable<ColumnDef<T>["id"]>, string>, boolean>>
}

const pageParamsSchema = z.object({
  dealType: z.enum(UnionDealTypeParams),
})

const DealsTable = <T extends DealBase>(props: DealsTableProps<T>) => {
  // const { dealType } = useTypedParams(pageParamsSchema)
  const { dealType } = useParams<{
    dealType: "retails" | "projects" | "contracts"
  }>()

  const getContextMenuActions: TableContextType<T>["getContextMenuActions"] = useCallback(
    (
      setOpenModal: React.Dispatch<React.SetStateAction<"delete" | "edit" | "more" | null>>,
      row: Row<T>,
    ) => ({
      edit: (
        <EditDealContextMenu
          close={() => setOpenModal(null)}
          id={row.original.id as string}
          type={row.original.type as DealType}
        />
      ),
      delete: (
        <DelDealContextMenu
          close={() => setOpenModal(null)}
          id={row.original.id as string}
          type={row.original.type as DealType}
        />
      ),
      more: <ModalDealInfo id={row.original.id as string} type={row.original.type as DealType} />,
    }),
    [],
  )

  return (
    <TableProvider<T>
      getContextMenuActions={getContextMenuActions}
      renderAdditionalInfo={(dealId: string) => <AdditionalContacts dealId={dealId} />}
    >
      <DataTable
        {...props}
        dealType={dealType}
        hiddenColumns={props.hiddenCols}
        rowData={({ table, openFilters, hasEditDeleteActions }) => (
          <TableComponent
            hasEditDeleteActions={hasEditDeleteActions}
            openFilters={openFilters}
            table={table}
          />
        )}
      >
        <AddNewDeal type={dealType} />
      </DataTable>
    </TableProvider>
  )
}

export default DealsTable
