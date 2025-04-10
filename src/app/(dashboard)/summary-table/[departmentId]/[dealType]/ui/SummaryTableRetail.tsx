"use client";

import React, { useCallback } from "react";
import { RetailResponse } from "@/entities/deal/types";
import { DealType, PermissionEnum } from "@prisma/client";
import { columnsDataRetailSummary } from "../[userId]/model/summary-columns-data-retail";
import { useGetAllRetails } from "@/entities/deal/hooks/query";
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import { useParams } from "next/navigation";
import SummaryTableTemplate from "./SummaryTableTemplate";
import useRedirectToLoginNotAuthUser from "@/shared/hooks/useRedirectToLoginNotAuthUser";
import dynamic from "next/dynamic";
import withAuthGuard from "@/widgets/Files/libs/hoc/withAuthGuard";

const AccessDeniedMessage = dynamic(() => import("@/shared/ui/AccessDeniedMessage"), { ssr: false });

const SummaryTableRetail = () => {

  useRedirectToLoginNotAuthUser();

  const { userId } = useParams();

  const hasAccess = hasAccessToDataSummary(
    userId as string,
    PermissionEnum.VIEW_UNION_REPORT
  );

  const {
    data: deals,
    error,
    isError,
  } = useGetAllRetails(hasAccess ? (userId as string) : null);

  const getRowLink =  useCallback((row: RetailResponse & { id: string }, type: string) => {
    return `/deal/${type.toLowerCase()}/${row.id}`;
  },[]);

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
    />
  );
};

export default withAuthGuard(SummaryTableRetail);
