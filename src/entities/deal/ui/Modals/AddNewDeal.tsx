"use client";

import React from "react";

import dynamic from "next/dynamic";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import FormOrderSkeleton from "@/entities/order/ui/FormOrderSkeleton";
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

const OrderForm = dynamic(() => import("@/entities/order/ui/OrderForm"), {
  ssr: false,
  loading: () => <FormOrderSkeleton />,
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
  orders: {
    title: "Добавить заявку",
    form: <OrderForm />,
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
