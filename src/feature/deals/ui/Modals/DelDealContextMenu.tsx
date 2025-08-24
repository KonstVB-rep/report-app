import { DealType, PermissionEnum } from "@prisma/client";

import React, { Dispatch, SetStateAction } from "react";

import dynamic from "next/dynamic";

import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions";

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
    <ProtectedByPermissions permissionArr={[PermissionEnum.DEAL_MANAGEMENT]}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Удалить проект</DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>

        <DelDealForm id={id} type={type} close={close} />
      </DialogContent>
    </ProtectedByPermissions>
  );
};

export default DelDealContextMenu;
