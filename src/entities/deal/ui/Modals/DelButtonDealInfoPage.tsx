import { DealType, PermissionEnum } from "@prisma/client";

import React from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import DialogComponent from "@/shared/ui/DialogComponent";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";

import DelDealSkeleton from "../Skeletons/DelDealSkeleton";

const DelDealForm = dynamic(() => import("../Forms/DelDealForm"), {
  ssr: false,
  loading: () => <DelDealSkeleton />,
});

const DelButtonDealInfoPage = ({
  id,
  type,
}: {
  id: string;
  type: DealType;
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.DEAL_MANAGEMENT]}>
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
          close={() => {
            setOpen(false);
            router.back();
          }}
        />
      </DialogComponent>
    </ProtectedByPermissions>
  );
};

export default DelButtonDealInfoPage;
