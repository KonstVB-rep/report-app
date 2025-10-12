import { useState } from "react"
import { FilePenLine } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import EditTaskForm from "../Forms/EditTaskForm"

const EditTaskDialogButton = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false)
  const closeModal = () => setOpen(false)

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
      <EditTaskForm close={closeModal} taskId={id} />
    </DialogComponent>
  )
}

export default EditTaskDialogButton
