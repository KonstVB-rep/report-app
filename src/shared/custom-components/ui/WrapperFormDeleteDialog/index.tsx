import React from "react";

import { Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import DialogComponent from "../DialogComponent";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  isTextButton?: boolean;
  children: React.ReactNode;
};

const WrapperFormDeleteDialog = ({
  open,
  setOpen,
  isTextButton = true,
  children,
}: Props) => {
  return (
    <DialogComponent
      open={open}
      onOpenChange={setOpen}
      dialogTitle="Удалить данные"
      contentTooltip="Удалить"
      classNameContent="sm:max-w-[400px]"
      trigger={
        <Button
          size={!isTextButton ? "icon" : "default"}
          variant={"destructive"}
          className="bg-red-500"
        >
          {isTextButton && <span>Удалить </span>} <Trash2 />
        </Button>
      }
    >
      {children}
    </DialogComponent>
  );
};

export default WrapperFormDeleteDialog;
