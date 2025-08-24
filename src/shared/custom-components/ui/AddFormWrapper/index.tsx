import React from "react";

import { SquarePlus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import DialogComponent from "../DialogComponent";

const AddFormWrapper = ({
  ariaLabel,
  dialogTitle,
  title,
  children,
  classBtn = "btn_hover w-full",
  classDialog = "sm:max-w-[600px]",
  classTitle = "ml-2 whitespace-nowrap text-sm",
}: {
  ariaLabel: string;
  title: string;
  dialogTitle: string;
  children: React.ReactNode;
  classBtn?: string;
  classDialog?: string;
  classTitle?: string;
}) => {
  return (
    <DialogComponent
      trigger={
        <Button variant="outline" className={classBtn} aria-label={ariaLabel}>
          <SquarePlus size={16} />
          <span className={classTitle}>{title}</span>
        </Button>
      }
      dialogTitle={dialogTitle}
      classNameContent={classDialog}
    >
      {children}
    </DialogComponent>
  );
};

export default AddFormWrapper;
