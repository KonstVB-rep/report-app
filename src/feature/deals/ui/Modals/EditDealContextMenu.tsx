import type { Dispatch, SetStateAction } from "react"
import { DealType } from "@prisma/client"
import dynamic from "next/dynamic"
import type { DealUnion } from "@/entities/deal/types"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"

const EditProject = dynamic(() => import("./EditProject"), { ssr: false })
const EditRetail = dynamic(() => import("./EditRetail"), { ssr: false })

const EditDealContextMenu = ({ close }: { close: Dispatch<SetStateAction<void>> }) => {
  const { selectedDataItem } = useTableContext<DealUnion>()

  if (!selectedDataItem) return null

  switch (selectedDataItem?.type) {
    case DealType.PROJECT:
      return (
        <EditProject
          close={close}
          selectedDataItem={selectedDataItem}
          titleForm="Редактировать проект"
        />
      )
    case DealType.RETAIL:
      return (
        <EditRetail
          close={close}
          selectedDataItem={selectedDataItem}
          titleForm="Редактировать розницу"
        />
      )
    default:
      return null
  }
}

export default EditDealContextMenu
