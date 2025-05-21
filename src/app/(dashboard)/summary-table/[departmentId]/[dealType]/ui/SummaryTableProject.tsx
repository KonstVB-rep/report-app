"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import React, { useCallback, useMemo } from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { useGetAllProjects } from "@/entities/deal/hooks/query";
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import { ProjectResponse } from "@/entities/deal/types";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import Loading from "../[userId]/loading";
import { columnsDataProjectSummary } from "../[userId]/model/summary-columns-data-project";
import SummaryTableTemplate from "./SummaryTableTemplate";

const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

const SummaryTableProject = () => {
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
  } = useGetAllProjects(
    hasAccess ? (userId as string) : null,
    departmentId as string
  );

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
