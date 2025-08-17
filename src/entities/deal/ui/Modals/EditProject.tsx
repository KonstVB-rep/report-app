"use client";

import React, { Dispatch, SetStateAction } from "react";

import dynamic from "next/dynamic";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import FormDealSkeleton from "../Skeletons/FormDealSkeleton";

const EditProjectForm = dynamic(() => import("../Forms/EditProjectForm"), {
  ssr: false,
  loading: () => <FormDealSkeleton />,
});

const EditProject = ({
  close,
  id,
  isInvalidate = false,
  titleForm = "Создать проект",
}: {
  close: Dispatch<SetStateAction<void>>;
  id: string;
  isInvalidate?: boolean;
  titleForm: string;
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
      <EditProjectForm
        close={close}
        dealId={id}
        isInvalidate={isInvalidate}
        titleForm={titleForm}
      />
    </DialogContent>
  );
};

export default EditProject;
