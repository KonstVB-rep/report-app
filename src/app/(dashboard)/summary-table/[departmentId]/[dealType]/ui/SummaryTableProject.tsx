"use client";

import React, { useCallback } from "react";
import { ProjectResponse } from "@/entities/deal/types";
import { DealType, PermissionEnum } from "@prisma/client";
import { columnsDataProjectSummary } from "../[userId]/model/summary-columns-data-project";
import { useGetAllProjects } from "@/entities/deal/hooks/query";
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import AccessDeniedMessage from "@/shared/ui/AccessDeniedMessage";
import { useParams } from "next/navigation";
import SummaryTableTemplate from "./SummaryTableTemplate";

const SummaryTableProject = () => {
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
      data={(deals as ProjectResponse[]) ?? []}
      getRowLink={getRowLink}
      type={DealType.PROJECT}
      isError={isError}
      error={error}
      isPending={isPending}
    />
  );
};

export default SummaryTableProject;
