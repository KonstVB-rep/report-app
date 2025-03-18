"use client";
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


import React, { Dispatch, SetStateAction } from "react";
import EditProjectForm from "../Forms/EditProjectForm";

const EditProject = ({
  close,
  id,
  type,
}: {
  close: Dispatch<SetStateAction<"add_project" | "edit_project" | null>>;
  id: string;
  type: string;
}) => {
  return (
    <DialogContent className="sm:max-w-[825px] max-h-[85vh] overflow-y-auto" showX={true}>
      <DialogHeader>
        <DialogTitle className="sr-only">Редактировать проект</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <EditProjectForm close={close} dealId={id} type={type} />
    </DialogContent>
  );
};

export default EditProject;
