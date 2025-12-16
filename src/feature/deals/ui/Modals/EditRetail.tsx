"use client"

import type { Dispatch, SetStateAction } from "react"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import EditRetailForm from "../Forms/EditRetailForm"

const EditRetail = ({
  close,
  id,
  isInvalidate = false,
  titleForm = "Создать розничную сделку",
}: {
  close: Dispatch<SetStateAction<void>>
  id: string
  isInvalidate?: boolean
  titleForm: string
}) => {
  return (
    <ModalContent
      className="max-h-[94vh] overflow-y-auto sm:max-w-[825px]"
      disableClose
      title="Редактировать проект"
    >
      <EditRetailForm close={close} dealId={id} isInvalidate={isInvalidate} titleForm={titleForm} />
    </ModalContent>
  )
}

export default EditRetail
