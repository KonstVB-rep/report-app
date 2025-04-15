"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import React, { useCallback } from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { useGetAllProjects } from "@/entities/deal/hooks/query";
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import { ProjectResponse } from "@/entities/deal/types";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import { columnsDataProjectSummary } from "../[userId]/model/summary-columns-data-project";
import SummaryTableTemplate from "./SummaryTableTemplate";

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
