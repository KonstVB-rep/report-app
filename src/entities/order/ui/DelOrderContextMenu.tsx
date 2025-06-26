import React, { Dispatch, SetStateAction } from "react";

import dynamic from "next/dynamic";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton";

const DelOrderForm = dynamic(() => import("./DelOrderForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
});

const DelOrderContextMenu = ({
  close,
  id,
}: {
  close: Dispatch<SetStateAction<void>>;
  id: string;
}) => {
  return (
    <DialogContent className="sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle className="sr-only">Удалить проект</DialogTitle>
        <DialogDescription className="sr-only" />
      </DialogHeader>

      <DelOrderForm id={id} close={close} />
    </DialogContent>
  );
};

export default DelOrderContextMenu;
