"use client"

import type { Dispatch, SetStateAction } from "react"
import type { RetailResponseWithContactsAndFiles } from "@/entities/deal/types"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import EditRetailForm from "../Forms/EditRetailForm"

const EditRetail = ({
  close,
  isInvalidate = false,
  titleForm = "Создать розничную сделку",
}: {
  close: Dispatch<SetStateAction<void>>
  isInvalidate?: boolean
  titleForm: string
}) => {
  const { selectedDataItem } = useTableContext<RetailResponseWithContactsAndFiles>()
  if (!selectedDataItem) return null
  return (
    <ModalContent
      className="max-h-[94vh] overflow-y-auto sm:max-w-[825px]"
      disableClose
      title="Редактировать проект"
    >
      <EditRetailForm
        close={close}
        dealInfo={selectedDataItem}
        isInvalidate={isInvalidate}
        titleForm={titleForm}
      />
    </ModalContent>
  )
}

export default EditRetail
