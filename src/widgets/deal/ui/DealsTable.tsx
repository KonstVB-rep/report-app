import type React from "react"
import { useCallback, useState } from "react"
import type { ColumnDef, Row } from "@tanstack/react-table"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import type { DealUnion } from "@/entities/deal/types"
import AdditionalContacts from "@/feature/deals/ui/AdditionalContacts"
import AddNewDeal from "@/feature/deals/ui/Modals/AddNewDeal"
import ColorPickerDeal from "@/feature/deals/ui/Modals/ColorPickerDeal"
import { EntityActionModal } from "@/shared/custom-components/ui/EntityActionModal"
import {
  type TableContextType,
  TableProvider,
} from "@/shared/custom-components/ui/Table/context/TableContext"
import TableComponent from "@/shared/custom-components/ui/Table/TableComponent"
import type { ModalType } from "@/shared/types"
import DataTable from "@/widgets/DataTable/ui/DataTable"

const EditDealContextMenu = dynamic(() => import("@/feature/deals/ui/Modals/EditDealContextMenu"), {
  ssr: false,
})

const DelDealContextMenu = dynamic(() => import("@/feature/deals/ui/Modals/DelDealContextMenu"), {
  ssr: false,
})

const ModalDealInfo = dynamic(() => import("@/feature/deals/ui/Modals/ModalDealInfo"), {
  ssr: false,
})

interface DealsTableProps<T extends DealUnion> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  hasEditDeleteActions?: boolean
  hiddenCols?: Partial<Record<Extract<NonNullable<ColumnDef<T>["id"]>, string>, boolean>>
}

const DealsTable = <T extends DealUnion>(props: DealsTableProps<T>) => {
  const { dealType } = useParams<{
    dealType: "retails" | "projects" | "contracts"
  }>()

  const [openedModal, setOpenedModal] = useState<"edit" | "delete" | "more" | "color" | null>(null)

  const [selectedDataItem, setSelectedDataItem] = useState<T | null>(null)

  const getContextMenuActions: TableContextType<T>["getContextMenuActions"] = useCallback(
    (row: Row<T>) => {
      return {
        edit: {
          onClick: () => {
            setSelectedDataItem(row.original)
            setOpenedModal("edit")
          },
        },
        delete: {
          onClick: () => {
            setSelectedDataItem(row.original)
            setOpenedModal("delete")
          },
        },
        more: {
          onClick: () => {
            setSelectedDataItem(row.original)
            setOpenedModal("more")
          },
        },
        color: {
          onClick: () => {
            setSelectedDataItem(row.original)
            setOpenedModal("color")
          },
        },
      }
    },
    [],
  )

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
          <TableComponent
            hasEditDeleteActions={hasEditDeleteActions}
            openFilters={openFilters}
            table={table}
          />
        )}
      >
        <AddNewDeal type={dealType} />
      </DataTable>
      <ActiveModalDeal openedModal={openedModal} setOpenedModal={setOpenedModal} />
    </TableProvider>
  )
}

export default DealsTable

const ActiveModalDeal = ({
  openedModal,
  setOpenedModal,
}: {
  openedModal: ModalType
  setOpenedModal: React.Dispatch<React.SetStateAction<"edit" | "delete" | "more" | "color" | null>>
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
