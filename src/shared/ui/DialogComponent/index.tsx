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

const DialogComponent = ({contentTooltip, trigger, children, showX = true, open = false, dialogTitle="",footer, classNameContent, onOpenChange = () => {}}:DialogComponentProps) => {

    return (
      <Dialog open={open ? open : undefined} onOpenChange={onOpenChange}>
        <TooltipComponent content={contentTooltip}>
          <DialogTrigger asChild onClick={open ? () => onOpenChange(true) : undefined}>
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