"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import { useCallback } from "react";

import dynamic from "next/dynamic";

import { useGetRetailsUser } from "@/entities/deal/hooks/query";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import { RetailResponse } from "@/entities/deal/types";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import { columnsDataRetail } from "../[userId]/model/columns-data-retail";
import PersonTable from "./PersonTable";

const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

const PersonTableRetail = ({ userId }: { userId: string }) => {
  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT
  );

  const { data: deals } = useGetRetailsUser(
    hasAccess ? (userId as string) : null
  );

  const getRowLink = useCallback(
    (row: RetailResponse) => `/deal/retail/${row.id}`,
    []
  );

  if (!hasAccess)
    return (
      <AccessDeniedMessage
        error={{ message: "у вас нет доступа к этому разделу" }}
      />
    );

  return (
    <PersonTable
      data={deals ?? []}
      type={DealType.RETAIL}
      columns={columnsDataRetail}
      getRowLink={getRowLink}
    />
  );
};

export default withAuthGuard(PersonTableRetail);
