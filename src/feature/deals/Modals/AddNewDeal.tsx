"use client";

import React from "react";

import dynamic from "next/dynamic";

import { Plus } from "lucide-react";

import FormDealSkeleton from "@/entities/deal/ui/Skeletons/FormDealSkeleton";
import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";
import ProtectedByDepartmentAffiliation from "@/shared/custom-components/ui/Protect/ProtectedByDepartmentAffiliation";

const ProjectForm = dynamic(() => import("../ui/Forms/ProjectForm"), {
  ssr: false,
  loading: () => <FormDealSkeleton />,
});
const RetailForm = dynamic(() => import("../ui/Forms/RetailForm"), {
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
  if (!contentType[type]) return null;

  return (
    <ProtectedByDepartmentAffiliation>
      <DialogComponent
        contentTooltip={contentType[type].title}
        trigger={
          <Button
            variant="outline"
            aria-label="Добавить новую сделку"
            className="ml-auto"
          >
            <Plus />
          </Button>
        }
      >
        {contentType[type]?.form}
      </DialogComponent>
    </ProtectedByDepartmentAffiliation>
  );
};

export default AddNewDeal;
