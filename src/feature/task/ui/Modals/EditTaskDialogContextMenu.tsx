import type { Dispatch, SetStateAction } from "react"
import type { TaskWithUserInfo } from "@/entities/task/types"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import EditTaskForm from "../Forms/EditTaskForm"

type Props = {
  close: Dispatch<SetStateAction<void>>
}

const EditTaskDialogContextMenu = ({ close }: Props) => {
  const { selectedDataItem } = useTableContext<TaskWithUserInfo>()

  if (!selectedDataItem) return null

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="sr-only">Удалить проект</DialogTitle>
        <DialogDescription className="sr-only" />
      </DialogHeader>
      <EditTaskForm close={close} data={selectedDataItem} />
    </DialogContent>
  )
}

export default EditTaskDialogContextMenu
