"use client";

import { DealType, PermissionEnum } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { useCallback, useMemo } from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { useGetAllProjects } from "@/entities/deal/hooks/query";
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import { ProjectResponse } from "@/entities/deal/types";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import { columnsDataProjectSummary } from "../[userId]/model/summary-columns-data-project";

const Loading = dynamic(() => import("../[userId]/loading"), { ssr: false });
const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

type SummaryTableProps = {
  columns: ColumnDef<ProjectResponse, unknown>[];
  data: ProjectResponse[];
  getRowLink: (row: ProjectResponse, type: DealType) => string;
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

const SummaryTableProject = () => {
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
  } = useGetAllProjects(hasAccess ? userId : null, departmentId);

  const getRowLink = useCallback(
    (row: ProjectResponse & { id: string }, type: string) => {
      return `/deal/${type.toLowerCase()}/${row.id}`;
    },
    []
  );

  if (!hasAccess) {
    return (
      <AccessDeniedMessage
        error={{ message: "у вас нет доступа к этому разделу" }}
      />
    );
  }

  if (isPending) return <Loading />;

  return (
    <SummaryTableTemplate
      columns={columnsDataProjectSummary}
      data={deals ?? []}
      getRowLink={getRowLink}
      type={DealType.PROJECT}
      isError={isError}
      error={error}
    />
  );
};

export default withAuthGuard(SummaryTableProject);
