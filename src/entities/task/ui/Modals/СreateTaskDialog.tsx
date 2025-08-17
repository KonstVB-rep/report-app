import React from "react";

import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";

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
      <h3 className="text-center font-semibold">Создать задачу</h3>
      <CreateTaskForm />
    </DialogComponent>
  );
};

export default СreateTaskDialog;
