import { useState } from "react"
import { FilePenLine } from "lucide-react"
import type { TaskWithUserInfo } from "@/entities/task/types"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import EditTaskForm from "../Forms/EditTaskForm"

const EditTaskDialogButton = ({ data }: { data: TaskWithUserInfo }) => {
  const [open, setOpen] = useState(false)
  const closeModal = () => setOpen(false)

  if (!data) return null

  return (
    <DialogComponent
      classNameContent="sm:max-w-[600px]"
      contentTooltip="Обновить"
      dialogTitle="Обновить задачу"
      onOpenChange={setOpen}
      open={open}
      trigger={
        <Button className="btn_hover" size="icon" variant={"outline"}>
          <FilePenLine />
        </Button>
      }
    >
      <EditTaskForm close={closeModal} data={data} />
    </DialogComponent>
  )
}

export default EditTaskDialogButton
