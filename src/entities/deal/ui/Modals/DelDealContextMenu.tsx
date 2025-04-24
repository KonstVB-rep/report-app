import { DealType } from "@prisma/client";

import React, { Dispatch, SetStateAction } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DelDealForm from "../Forms/DelDealForm";

const DelDealContextMenu = ({
  close,
  id,
  type,
}: {
  close: Dispatch<SetStateAction<void>>;
  id: string;
  type: DealType;
}) => {
  
  return (

      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Удалить проект</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <DelDealForm id={id} type={type} close={close} />
      </DialogContent>
  );
};

export default DelDealContextMenu;
