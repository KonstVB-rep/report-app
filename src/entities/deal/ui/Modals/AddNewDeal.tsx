"use client";

import React from "react";

import dynamic from "next/dynamic";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import DialogComponent from "@/shared/ui/DialogComponent";
import ProtectedByDepartmentAffiliation from "@/shared/ui/Protect/ProtectedByDepartmentAffiliation";

import FormDealSkeleton from "../Skeletons/FormDealSkeleton";

const ProjectForm = dynamic(() => import("../Forms/ProjectForm"), {
  ssr: false,
  loading: () => <FormDealSkeleton />,
});
const RetailForm = dynamic(() => import("../Forms/RetailForm"), {
  ssr: false,
  loading: () => <FormDealSkeleton />,
});

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
    <ProtectedByDepartmentAffiliation>
      <DialogComponent
        contentTooltip={contentType[type].title}
        trigger={
          <Button variant="outline" aria-label="Добавить новую сделку">
            <Plus />
          </Button>
        }
      >
        {contentType[type].form}
      </DialogComponent>
    </ProtectedByDepartmentAffiliation>
  );
};

export default AddNewDeal;
