"use client"

import type { Dispatch, SetStateAction } from "react"
import type { DealRetail } from "@/entities/deal/types"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import EditRetailForm from "../Forms/EditRetailForm"

const EditRetail = ({
  close,
  selectedDataItem,
  isInvalidate = false,
  titleForm = "Создать розничную сделку",
}: {
  close: Dispatch<SetStateAction<void>>
  selectedDataItem: DealRetail
  isInvalidate?: boolean
  titleForm: string
}) => {
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
