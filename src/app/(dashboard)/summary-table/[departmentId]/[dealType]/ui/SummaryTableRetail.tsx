"use client";

import React from "react";
import { RetailResponse } from "@/entities/deal/types";
import { DealType, PermissionEnum } from "@prisma/client";
import { columnsDataRetailSummary } from "../[userId]/model/summary-columns-data-retail";
import { useGetAllRetails } from "@/entities/deal/hooks/query";
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import { useParams } from "next/navigation";
import SummaryTableTemplate from "./SummaryTableTemplate";
import AccessDeniedMessage from "@/shared/ui/AccessDeniedMessage";

const SummaryTableRetail = () => {
  const { userId } = useParams();

  const hasAccess = hasAccessToDataSummary(
    userId as string,
    PermissionEnum.VIEW_UNION_REPORT
  );

  const {
    data: deals,
    error,
    isPending,
    isError,
  } = useGetAllRetails(hasAccess ? (userId as string) : null);

  const getRowLink = (row: RetailResponse & { id: string }, type: string) => {
    return `/deal/${type.toLowerCase()}/${row.id}`;
  };

  if (!hasAccess)
    return (
      <AccessDeniedMessage
        error={{ message: "у вас нет доступа к этому разделу" }}
      />
    );

  return (
    <SummaryTableTemplate
      columns={columnsDataRetailSummary}
      data={(deals as RetailResponse[]) ?? []}
      getRowLink={getRowLink}
      type={DealType.RETAIL}
      isError={isError}
      error={error}
      isPending={isPending}
    />
  );
};

export default SummaryTableRetail;
