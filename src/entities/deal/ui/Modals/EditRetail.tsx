"use client";
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import React, { Dispatch, SetStateAction } from "react";
import EditRetailForm from "../Forms/EdiRetailForm";

const EditProject = ({
  close,
  id,
}: {
  close: Dispatch<SetStateAction<"add_project" | "edit_project" | null>>;
  id: string;
}) => {
  return (
    <DialogContent className="sm:max-w-[825px] max-h-[85vh] overflow-y-auto" showX={true}>
      <DialogHeader>
        <DialogTitle className="sr-only">Редактировать розничную сделку</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <EditRetailForm close={close} dealId={id}/>
    </DialogContent>
  );
};

export default EditProject;
