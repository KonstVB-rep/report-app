"use client"

import type React from "react"
import { useCallback, useState } from "react"
import type { ColumnDef, Row } from "@tanstack/react-table"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import type { BaseDeal } from "@/entities/deal/types"
import AdditionalContacts from "@/feature/deals/ui/AdditionalContacts"
import AddNewDeal from "@/feature/deals/ui/Modals/AddNewDeal"
import { EntityActionModal } from "@/shared/custom-components/ui/EntityActionModal"
import {
  type TableContextType,
  TableProvider,
} from "@/shared/custom-components/ui/Table/context/TableContext"
import TableComponent from "@/shared/custom-components/ui/Table/TableComponent"
import DataTable from "@/widgets/DataTable/ui/DataTable"

type DealModalType = "edit" | "delete" | "more" | "color" | null

const modalLoadingProps = {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  ),
} as const

const EditDealContextMenu = dynamic(() => import("@/feature/deals/ui/Modals/EditDealContextMenu"), {
  ...modalLoadingProps,
})

const DelDealContextMenu = dynamic(() => import("@/feature/deals/ui/Modals/DelDealContextMenu"), {
  ...modalLoadingProps,
})

const ModalDealInfo = dynamic(() => import("@/feature/deals/ui/Modals/ModalDealInfo"), {
  ...modalLoadingProps,
})

const ColorPickerDeal = dynamic(() => import("@/feature/deals/ui/Modals/ColorPickerDeal"), {
  ...modalLoadingProps,
})

interface DealsTableProps<T extends BaseDeal> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  tableName: string
  hasEditDeleteActions?: boolean
  hiddenCols?: Record<string, boolean>
}

const DealsTable = <T extends BaseDeal>(props: DealsTableProps<T>) => {
  const { dealType } = useParams<{
    dealType: "retails" | "projects" | "contracts"
  }>()

  const [openedModal, setOpenedModal] = useState<DealModalType>(null)
  const [selectedDataItem, setSelectedDataItem] = useState<T | null>(null)

  const getContextMenuActions: TableContextType<T>["getContextMenuActions"] = useCallback(
    (row: Row<T>) => {
      const createAction = (modal: NonNullable<DealModalType>) => ({
        onClick: () => {
          setSelectedDataItem(row.original)
          setOpenedModal(modal)
        },
      })

      return {
        edit: createAction("edit"),
        delete: createAction("delete"),
        more: createAction("more"),
        color: createAction("color"),
      }
    },
    [],
  )

  if (!dealType) {
    return null
  }

  return (
    <TableProvider<T>
      getContextMenuActions={getContextMenuActions}
      renderAdditionalInfo={(dealId: string) => <AdditionalContacts dealId={dealId} />}
      selectedDataItem={selectedDataItem}
    >
      <DataTable
        {...props}
        dealType={dealType}
        hiddenColumns={props.hiddenCols}
        rowData={({ table, openFilters, hasEditDeleteActions }) => (
          <TableComponent<T>
            hasEditDeleteActions={hasEditDeleteActions}
            openFilters={openFilters}
            table={table}
          />
        )}
        tableName={props.tableName}
      >
        <AddNewDeal type={dealType} />
      </DataTable>
      <ActiveModalDeal openedModal={openedModal} setOpenedModal={setOpenedModal} />
    </TableProvider>
  )
}
const ActiveModalDeal = ({
  openedModal,
  setOpenedModal,
}: {
  openedModal: DealModalType
  setOpenedModal: React.Dispatch<React.SetStateAction<DealModalType>>
}) => (
  <EntityActionModal
    openedModal={openedModal}
    renderMap={{
      edit: (close) => <EditDealContextMenu close={close} />,
      more: () => <ModalDealInfo />,
      delete: (close) => <DelDealContextMenu close={close} />,
      color: () => <ColorPickerDeal />,
    }}
    setOpenedModal={setOpenedModal}
  />
)

export default DealsTable
