import type React from "react"
import { SquarePlus } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import DialogComponent from "../DialogComponent"

const AddFormWrapper = ({
  ariaLabel,
  dialogTitle,
  title,
  children,
  classBtn = "btn_hover w-full",
  classDialog = "sm:max-w-[600px]",
  classTitle = "ml-2 whitespace-nowrap text-sm",
}: {
  ariaLabel: string
  title: string
  dialogTitle: string
  children: React.ReactNode
  classBtn?: string
  classDialog?: string
  classTitle?: string
}) => {
  return (
    <DialogComponent
      classNameContent={classDialog}
      dialogTitle={dialogTitle}
      trigger={
        <Button aria-label={ariaLabel} className={classBtn} variant="outline">
          <SquarePlus size={16} />
          <span className={classTitle}>{title}</span>
        </Button>
      }
    >
      {children}
    </DialogComponent>
  )
}

export default AddFormWrapper
