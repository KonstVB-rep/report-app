"use client"

import type { Dispatch, SetStateAction } from "react"
import type { DealProject } from "@/entities/deal/types"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import EditProjectForm from "../Forms/EditProjectForm"

const EditProject = ({
  close,
  selectedDataItem,
  isInvalidate = false,
  titleForm = "Создать проект",
}: {
  close: Dispatch<SetStateAction<void>>
  selectedDataItem: DealProject
  isInvalidate?: boolean
  titleForm: string
}) => {
  return (
    <ModalContent
      className="max-h-[94vh] overflow-y-auto sm:max-w-[825px]"
      disableClose
      title="Редактировать проект"
    >
      <EditProjectForm
        close={close}
        dealInfo={selectedDataItem}
        isInvalidate={isInvalidate}
        titleForm={titleForm}
      />
    </ModalContent>
  )
}

export default EditProject
