import React from "react";

import CreateTaskForm from "../Forms/CreateTaskForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DialogComponent from "@/shared/ui/DialogComponent";

const СreateTaskDialog = () => {
  return (
    <DialogComponent
      trigger={
        <Button variant="default">
          <Plus /> Новая
        </Button>
      }
    >
      <div>
        <h3 className="text-center font-semibold">Создать задачу</h3>
        <CreateTaskForm />
      </div>
    </DialogComponent>
  );
};

export default СreateTaskDialog;
