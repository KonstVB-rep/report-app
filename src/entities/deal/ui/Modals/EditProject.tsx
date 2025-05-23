"use client";

import React, { Dispatch, SetStateAction } from "react";

import dynamic from "next/dynamic";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import FormDealSkeleton from "../Skeletons/FormDealSkeleton";

const EditProjectForm = dynamic(() => import("../Forms/EditProjectForm"), {
  ssr: false,
  loading: () => <FormDealSkeleton />,
});

const EditProject = ({
  close,
  id,
}: {
  close: Dispatch<SetStateAction<void>>;
  id: string;
}) => {
  return (
    <DialogContent
      className="max-h-[94vh] overflow-y-auto sm:max-w-[825px]"
      showX={true}
    >
      <DialogHeader>
        <DialogTitle className="sr-only">Редактировать проект</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <EditProjectForm close={close} dealId={id} />
    </DialogContent>
  );
};

export default EditProject;
