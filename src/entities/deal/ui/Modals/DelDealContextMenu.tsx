import { DealType } from "@prisma/client";

import React, { Dispatch, SetStateAction } from "react";

import dynamic from "next/dynamic";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import DelDealSkeleton from "../Skeletons/DelDealSkeleton";

const DelDealForm = dynamic(() => import("../Forms/DelDealForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
});

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
        <DialogTitle className="sr-only">Удалить проект</DialogTitle>
        <DialogDescription className="sr-only" />
      </DialogHeader>

      <DelDealForm id={id} type={type} close={close} />
    </DialogContent>
  );
};

export default DelDealContextMenu;
