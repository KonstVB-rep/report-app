import type { Dispatch, SetStateAction } from "react"
import type { TaskWithUserInfo } from "@/entities/task/types"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { useTableContext } from "@/shared/custom-components/ui/Table/context/TableContext"
import DelTaskForm from "../Forms/DelTaskForm"

type Props = {
  close: Dispatch<SetStateAction<void>>
}

const DelTaskDialogContextMenu = ({ close }: Props) => {
  const { selectedDataItem } = useTableContext<TaskWithUserInfo>()
  if (!selectedDataItem) return null
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="sr-only">Удалить проект</DialogTitle>
        <DialogDescription className="sr-only" />
      </DialogHeader>
      <DelTaskForm close={close} data={selectedDataItem} />
    </DialogContent>
  )
}

export default DelTaskDialogContextMenu
