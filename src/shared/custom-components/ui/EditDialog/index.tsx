import React from "react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import DialogComponent from "../DialogComponent";

type EditDataDialogProps = {
  children: React.ReactNode;
  textButtonShow?: boolean;
  title?: string;
  description?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  icon?: React.ReactNode;
  className?: string;
};

const EditDataDialog = ({
  children,
  textButtonShow = false,
  title,
  description,
  icon,
  open,
  setOpen,
  className = "flex items-center gap-2 border-none px-2 btn_hover shrink-0",
}: EditDataDialogProps) => {
  return (
    <DialogComponent
      open={open}
      onOpenChange={setOpen}
      dialogTitle={title}
      description={description}
      trigger={
        <Button
          variant="outline"
          aria-label={title}
          title={title}
          size={!textButtonShow ? "icon" : "default"}
          className={cn(
            className,
            textButtonShow ? "justify-start" : "justify-center"
          )}
        >
          {icon}
          {textButtonShow && "Редактировать"}
        </Button>
      }
      classNameContent="sm:max-w-[600px] w-full"
    >
      {children}
    </DialogComponent>
  );
};

export default EditDataDialog;
