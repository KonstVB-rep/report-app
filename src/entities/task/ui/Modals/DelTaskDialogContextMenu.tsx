import React, { Dispatch, SetStateAction } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import DelTaskForm from "../Forms/DelTaskForm";

type Props = {
  id: string;
  close: Dispatch<SetStateAction<void>>;
};

const DelTaskDialogContextMenu = ({ id, close }: Props) => {
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="sr-only">Удалить проект</DialogTitle>
        <DialogDescription className="sr-only" />
      </DialogHeader>
      <DelTaskForm id={id} close={close} />
    </DialogContent>
  );
};

export default DelTaskDialogContextMenu;
