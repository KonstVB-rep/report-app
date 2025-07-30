import React, { useState } from "react";

import { FilePenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import DialogComponent from "@/shared/ui/DialogComponent";

import EditTaskForm from "../Forms/EditTaskForm";

const EditTaskDialogButton = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  return (
    <DialogComponent
      open={open}
      onOpenChange={setOpen}
      dialogTitle="Обновить задачу"
      contentTooltip="Обновить"
      classNameContent="sm:max-w-[600px]"
      trigger={
        <Button size="icon" variant={"outline"} className="btn_hover">
          <FilePenLine />
        </Button>
      }
    >
      <EditTaskForm close={closeModal} taskId={id} />
    </DialogComponent>
  );
};

export default EditTaskDialogButton;
