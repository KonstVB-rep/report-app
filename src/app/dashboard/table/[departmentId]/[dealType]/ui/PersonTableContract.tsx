"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import { useCallback } from "react";

import dynamic from "next/dynamic";

import { useGetContractsUser } from "@/entities/deal/hooks/query";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import { ContractResponse } from "@/entities/deal/types";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import { columnsDataContract } from "../[userId]/model/columns-data-contracts";
import PersonTable from "./PersonTable";

const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

const PersonTableContract = ({ userId }: { userId: string }) => {
  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT
  );

  const { data: contracts } = useGetContractsUser(
    hasAccess && (userId as string | undefined) ? (userId as string) : undefined
  );

  const getRowLink = useCallback(
    (row: ContractResponse) => `/deal/project/${row.id}`,
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
      data={contracts ?? []}
      type={DealType.PROJECT}
      columns={columnsDataContract}
      getRowLink={getRowLink}
    />
  );
};

export default withAuthGuard(PersonTableContract);
