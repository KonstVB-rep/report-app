import { DealType, PermissionEnum } from "@prisma/client";

import React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { useGetUser } from "@/entities/user/hooks/query";
import ProfileSettings from "@/entities/user/ui/ProfileSettings";
import HoverCardComponent from "@/shared/ui/HoverCard";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";

import LinkToUserTable from "./LinkToUserTable";

const SummaryTableLink = dynamic(() => import("./SummaryTableLink"), {
  ssr: false,
});

const ButtonsGroupTable = () => {
  const { userId } = useParams();

  const { data: user } = useGetUser(userId as string);

  if (!user) return null;

  return (
    <div className="flex items-center justify-between gap-2">
      <ProfileSettings user={user} />

      <div className="flex gap-2">
        <LinkToUserTable />

        <ProtectedByPermissions
          permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}
        >
          <HoverCardComponent title="Сводная таблица">
            <SummaryTableLink type={DealType.PROJECT} />

            <SummaryTableLink type={DealType.RETAIL} />
          </HoverCardComponent>
        </ProtectedByPermissions>
      </div>
    </div>
  );
};

export default ButtonsGroupTable;
