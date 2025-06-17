import React, { Dispatch, SetStateAction } from "react";


import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


import EditTaskForm from "../Forms/EditTaskForm";

type Props = {
  id: string;
  close: Dispatch<SetStateAction<void>>;
};

const EditTaskDialogContextMenu = ({ id, close }: Props) => {
  return (

    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="sr-only">Удалить проект</DialogTitle>
        <DialogDescription className="sr-only" />
      </DialogHeader>
      <EditTaskForm close={close} taskId={id} />
    </DialogContent>
  );
};

export default EditTaskDialogContextMenu;
