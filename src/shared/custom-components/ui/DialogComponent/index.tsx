import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import TooltipComponent from "../TooltipComponent"

type DialogComponentProps = {
  contentTooltip?: string
  trigger?: React.ReactNode
  children: React.ReactNode
  showX?: boolean
  open?: boolean
  dialogTitle?: string
  footer?: React.ReactNode
  onOpenChange?: (value: boolean) => void
  classNameContent?: string
  disableClose?: boolean
  description?: string
}

const DialogComponent = ({
  contentTooltip = "",
  trigger,
  children,
  showX = true,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  dialogTitle = "",
  footer,
  classNameContent,
  disableClose = false,
  description,
}: DialogComponentProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const onOpenChange = isControlled ? (controlledOnOpenChange ?? (() => {})) : setInternalOpen

  const renderTrigger = () => {
    const triggerElement = trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null

    return contentTooltip ? (
      <TooltipComponent content={contentTooltip}>{triggerElement}</TooltipComponent>
    ) : (
      triggerElement
    )
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      {renderTrigger()}
      <DialogContent
        className={`max-w-[90vw] sm:max-w-[825px] ${classNameContent}`}
        onInteractOutside={(e) => {
          if (disableClose) e.preventDefault()
        }}
        showX={showX}
      >
        <DialogHeader className={`${!dialogTitle && "sr-only m-0 p-0"}`}>
          <DialogTitle className="text-center text-sm uppercase">{dialogTitle}</DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
        </DialogHeader>
        {children}
        {footer}
      </DialogContent>
    </Dialog>
  )
}

export default DialogComponent
