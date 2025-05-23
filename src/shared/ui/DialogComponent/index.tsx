import React, { Dispatch, SetStateAction } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import TooltipComponent from "../TooltipComponent";

type DialogComponentProps = {
  contentTooltip?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  showX?: boolean;
  open?: boolean;
  dialogTitle?: string;
  footer?: React.ReactNode;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  classNameContent?: string;
  disableClose?: boolean;
};

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
}: DialogComponentProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange! : setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {contentTooltip ? (
        <TooltipComponent content={contentTooltip}>
          <DialogTrigger asChild>{trigger}</DialogTrigger>
        </TooltipComponent>
      ) : (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      )}
      <DialogContent
        className={`max-w-[90vw] sm:max-w-[825px] ${classNameContent}`}
        showX={showX}
        onInteractOutside={(e) => {
          if (disableClose) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (disableClose) e.preventDefault();
        }}
      >
        <DialogHeader className={`${!dialogTitle && "sr-only m-0 p-0"}`}>
          <DialogTitle className="text-center text-sm uppercase">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        {children}
        {footer}
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
