"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import React, { useCallback, useMemo } from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { useGetAllRetails } from "@/entities/deal/hooks/query";
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import { RetailResponse } from "@/entities/deal/types";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import Loading from "../[userId]/loading";
import { columnsDataRetailSummary } from "../[userId]/model/summary-columns-data-retail";
import SummaryTableTemplate from "./SummaryTableTemplate";

const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

const SummaryTableRetail = () => {
  const { userId, departmentId } = useParams();

  const hasAccess = useMemo(
    () =>
      userId
        ? hasAccessToDataSummary(
            userId as string,
            PermissionEnum.VIEW_UNION_REPORT
          )
        : false,
    [userId]
  );

  const {
    data: deals,
    error,
    isError,
    isPending,
  } = useGetAllRetails(
    hasAccess ? (userId as string) : null,
    departmentId as string
  );

  const getRowLink = useCallback(
    (row: RetailResponse & { id: string }, type: string) => {
      return `/deal/${type.toLowerCase()}/${row.id}`;
    },
    []
  );

  if (!hasAccess)
    return (
      <AccessDeniedMessage
        error={{ message: "у вас нет доступа к этому разделу" }}
      />
    );

  if (isPending) return <Loading />;

  return (
    <SummaryTableTemplate
      columns={columnsDataRetailSummary}
      data={deals ?? []}
      getRowLink={getRowLink}
      type={DealType.RETAIL}
      isError={isError}
      error={error}
    />
  );
};

export default withAuthGuard(SummaryTableRetail);
