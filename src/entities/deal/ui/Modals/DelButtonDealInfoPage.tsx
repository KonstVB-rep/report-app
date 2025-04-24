import { DealType } from "@prisma/client";

import React from "react";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";;
import DialogComponent from "@/shared/ui/DialogComponent";;
import DelDealForm from "../Forms/DelDealForm";

const DelButtonDealInfoPage = ({
  id,
  type,
}: {
  id: string;
  type: DealType;
}) => {

  const [open, setOpen] = React.useState(false);


  return (
    <DialogComponent
      open={open}
      onOpenChange={setOpen}
      dialogTitle="Удалить данные"
      contentTooltip="Удалить"
      classNameContent="sm:max-w-[400px]"
      trigger={
        <Button size="icon" variant={"destructive"}>
          <Trash2 />
        </Button>
      }
    >
      <DelDealForm
        id={id}
        type={type}
        close={() => setOpen(false)}
      />
    </DialogComponent>
  );
};

export default DelButtonDealInfoPage;
