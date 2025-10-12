import type React from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "../DialogComponent"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  isTextButton?: boolean
  children: React.ReactNode
}

const WrapperFormDeleteDialog = ({ open, setOpen, isTextButton = true, children }: Props) => {
  return (
    <DialogComponent
      classNameContent="sm:max-w-[400px]"
      contentTooltip="Удалить"
      dialogTitle="Удалить данные"
      onOpenChange={setOpen}
      open={open}
      trigger={
        <Button
          className="bg-red-500 text-white"
          size={!isTextButton ? "icon" : "default"}
          variant={"destructive"}
        >
          {isTextButton && <span>Удалить </span>} <Trash2 />
        </Button>
      }
    >
      {children}
    </DialogComponent>
  )
}

export default WrapperFormDeleteDialog
