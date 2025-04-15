"use client";

import React, { Dispatch, SetStateAction } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import EditRetailForm from "../Forms/EditRetailForm";

const EditRetail = ({
  close,
  id,
}: {
  close: Dispatch<SetStateAction<void>>;
  id: string;
}) => {
  return (
    <DialogContent
      className="max-h-[85vh] overflow-y-auto sm:max-w-[825px]"
      showX={true}
    >
      <DialogHeader>
        <DialogTitle className="sr-only">
          Редактировать розничную сделку
        </DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <EditRetailForm close={close} dealId={id} />
    </DialogContent>
  );
};

export default EditRetail;
