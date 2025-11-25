import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "@/shared/custom-components/ui/DialogComponent"
import DelTaskForm from "../Forms/DelTaskForm"

type Props = {
  id: string
}

const DelTaskDialogButton = ({ id }: Props) => {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
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
      <DelTaskForm close={close} id={id} />
    </DialogComponent>
  )
}

export default DelTaskDialogButton
