import { DealType, PermissionEnum } from "@prisma/client";

import React, { Dispatch, SetStateAction } from "react";

import dynamic from "next/dynamic";

import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton";
import ModalContent from "@/shared/custom-components/ui/ModalContent";
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
      <ModalContent title="Удалить проект" className="sm:max-w-[400px]">
        <DelDealForm id={id} type={type} close={close} />
      </ModalContent>
    </ProtectedByPermissions>
  );
};

export default DelDealContextMenu;
