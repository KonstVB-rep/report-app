"use client"

import type { Dispatch, SetStateAction } from "react"
import type { ProjectResponseWithContactsAndFiles } from "@/entities/deal/types"
import ModalContent from "@/shared/custom-components/ui/ModalContent"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import EditProjectForm from "../Forms/EditProjectForm"

const EditProject = ({
  close,
  isInvalidate = false,
  titleForm = "Создать проект",
}: {
  close: Dispatch<SetStateAction<void>>
  isInvalidate?: boolean
  titleForm: string
}) => {
  const { selectedDataItem } = useTableContext<ProjectResponseWithContactsAndFiles>()

  if (!selectedDataItem) return null

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
