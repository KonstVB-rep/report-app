"use client";

import React from "react";

import dynamic from "next/dynamic";

import FormDealSkeleton from "@/entities/deal/ui/Skeletons/FormDealSkeleton";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

const EditOrderForm = dynamic(() => import("./EditOrderForm"), {
  ssr: false,
  loading: () => <FormDealSkeleton />,
});

const EditOrderContectMenu = ({
  close,
  id,
}: {
  close: () => void;
  id: string;
}) => {
  return (
    <DialogContent
      className="max-h-[85vh] overflow-y-auto sm:max-w-[825px]"
      showX={true}
    >
      <DialogHeader>
        <DialogTitle className="sr-only">Редактировать заявку</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <EditOrderForm close={close} dealId={id} />
    </DialogContent>
  );
};

export default EditOrderContectMenu;
