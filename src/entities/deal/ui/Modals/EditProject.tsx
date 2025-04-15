"use client";

import React, { Dispatch, SetStateAction } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EditProjectForm from "../Forms/EditProjectForm";

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
