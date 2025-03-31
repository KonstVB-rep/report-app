import { Dialog,DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import React, { Dispatch, SetStateAction } from 'react'
import TooltipComponent from '../TooltipComponent'

type DialogComponentProps = {
    contentTooltip: string;
    trigger: React.ReactNode;
    children: React.ReactNode;
    showX?: boolean;
    open?: boolean;
    dialogTitle?:string;
    footer?: React.ReactNode,
    onOpenChange?: Dispatch<SetStateAction<boolean>>
    classNameContent?: string
}

const DialogComponent = ({contentTooltip, trigger, children, showX = true, open: controlledOpen, onOpenChange: controlledOnOpenChange, dialogTitle="",footer, classNameContent}:DialogComponentProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange! : setInternalOpen;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <TooltipComponent content={contentTooltip}>
          <DialogTrigger asChild>
            {trigger}
          </DialogTrigger>
        </TooltipComponent>
        <DialogContent className={`sm:max-w-[825px] ${classNameContent}`} showX={showX}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {children}
          {footer}
        </DialogContent>
      </Dialog>
  )
}

export default DialogComponent