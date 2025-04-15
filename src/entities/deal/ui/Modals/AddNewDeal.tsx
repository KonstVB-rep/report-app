"use client";

import React from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import DialogComponent from "@/shared/ui/DialogComponent";

import ProjectForm from "../Forms/ProjectForm";
import RetailForm from "../Forms/RetailForm";

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
