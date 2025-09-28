import { DealType, PermissionEnum } from "@prisma/client";

import React from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton";
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions";
import WrapperFormDeleteDialog from "@/shared/custom-components/ui/WrapperFormDeleteDialog";

const DelDealForm = dynamic(() => import("../Forms/DelDealForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
});

const DelButtonDeal = ({
  id,
  type,
  isTextButton = false,
}: {
  id: string;
  type: DealType;
  isTextButton?: boolean;
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  return (
    <ProtectedByPermissions permission={PermissionEnum.DEAL_MANAGEMENT}>
      <WrapperFormDeleteDialog
        open={open}
        setOpen={setOpen}
        isTextButton={isTextButton}
      >
        <DelDealForm
          id={id}
          type={type}
          close={() => {
            setOpen(false);
            router.back();
          }}
        />
      </WrapperFormDeleteDialog>
    </ProtectedByPermissions>
  );
};

export default DelButtonDeal;
