import { DealType, PermissionEnum } from "@prisma/client";

import React from "react";

import dynamic from "next/dynamic";

import { DeletingDealsListItem } from "@/entities/deal/types";
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton";
import WrapperFormDeleteDialog from "@/shared/custom-components/ui/WrapperFormDeleteDialog";

const DelDealListForm = dynamic(() => import("../Forms/DelDealListForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
});

const DelButtonMultiDeals = ({
  deals,
  isTextButton = true,
}: {
  deals: DeletingDealsListItem[];
  isTextButton?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <WrapperFormDeleteDialog
      open={open}
      setOpen={setOpen}
      isTextButton={isTextButton}
    >
      <DelDealListForm deals={deals} close={() => setOpen(false)} />
    </WrapperFormDeleteDialog>
  );
};

export default DelButtonMultiDeals;
