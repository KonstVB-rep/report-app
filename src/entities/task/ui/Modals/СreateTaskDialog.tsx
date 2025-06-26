import React from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import DialogComponent from "@/shared/ui/DialogComponent";

import CreateTaskForm from "../Forms/CreateTaskForm";

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
