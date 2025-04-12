"use client";

import React, { useCallback } from "react";
import { ProjectResponse } from "@/entities/deal/types";
import { DealType, PermissionEnum } from "@prisma/client";
import { columnsDataProjectSummary } from "../[userId]/model/summary-columns-data-project";
import { useGetAllProjects } from "@/entities/deal/hooks/query";
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import { useParams } from "next/navigation";
import SummaryTableTemplate from "./SummaryTableTemplate";
import dynamic from "next/dynamic";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

const SummaryTableProject = () => {
  const { userId } = useParams();

  const hasAccess = hasAccessToDataSummary(
    userId as string,
    PermissionEnum.VIEW_UNION_REPORT
  );

  const {
    data: deals,
    error,
    isError,
  } = useGetAllProjects(hasAccess ? (userId as string) : null);

  const getRowLink = useCallback(
    (row: ProjectResponse & { id: string }, type: string) => {
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
