"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

import RetailForm from "../Forms/RetailForm";
import ProjectForm from "../Forms/ProjectForm";
import DialogComponent from "@/shared/ui/DialogComponent";

type AddNewDealProps = {
  type: string;
};

const contentType: Record<string, { title: string; form: React.ReactNode }> = {
  projects: {
    title: "Добавить проект",
    form: <ProjectForm />,
  },
  retails: {
    title: "Добавить cделку по рознице",
    form: <RetailForm />,
  },
};

const AddNewDeal = ({ type }: AddNewDealProps) => {
  // const [open, setOpen] = useState(false);
  return (
    <DialogComponent
      contentTooltip={contentType[type].title}
      trigger={
        <Button variant="outline">
          <Plus />
        </Button>
      }
    >
      {contentType[type].form}
    </DialogComponent>
  );
};

export default AddNewDeal;
