import { useState } from "react"
import { Trash2 } from "lucide-react"
import type { TaskWithUserInfo } from "@/entities/task/types"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import DelTaskForm from "../Forms/DelTaskForm"

const DelTaskDialogButton = ({ data }: { data: TaskWithUserInfo }) => {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  if (!data) return null

  return (
    <DialogComponent
      classNameContent="sm:max-w-[600px]"
      contentTooltip="Удалить"
      dialogTitle="Удалить данные"
      onOpenChange={setOpen}
      open={open}
      trigger={
        <Button size="icon" variant={"destructive"}>
          <Trash2 />
        </Button>
      }
    >
      <DelTaskForm close={close} data={data} />
    </DialogComponent>
  )
}

export default DelTaskDialogButton
