"use client";

import { DealType, PermissionEnum } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { useCallback, useMemo } from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { useGetAllRetails } from "@/entities/deal/hooks/query";
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import { RetailResponse } from "@/entities/deal/types";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import { columnsDataRetailSummary } from "../[userId]/model/summary-columns-data-retail";

// import SummaryTableTemplate from "./SummaryTableTemplate";

const Loading = dynamic(() => import("../[userId]/loading"), { ssr: false });
const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

type SummaryTableProps = {
  columns: ColumnDef<RetailResponse, unknown>[];
  data: RetailResponse[];
  getRowLink: (row: RetailResponse, type: DealType) => string;
  type: DealType;
  isError: boolean;
  error: Error | null;
};

const SummaryTableTemplate = dynamic<SummaryTableProps>(
  () => import("./SummaryTableTemplate"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const SummaryTableRetail = () => {
  const { userId, departmentId } = useParams<{
    userId: string;
    departmentId: string;
  }>();

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
  } = useGetAllRetails(hasAccess ? userId : null, departmentId);

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
