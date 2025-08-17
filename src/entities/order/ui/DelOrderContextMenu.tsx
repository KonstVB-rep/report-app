import React from "react";

import dynamic from "next/dynamic";

import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

const DelOrderForm = dynamic(() => import("./DelOrderForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
});

const DelOrderContextMenu = ({
  close,
  id,
}: {
  close: () => void;
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
