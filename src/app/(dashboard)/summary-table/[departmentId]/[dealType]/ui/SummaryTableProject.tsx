"use client";

import React, { useCallback } from "react";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import { ProjectResponse } from "@/entities/deal/types";
import DataTable from "@/shared/ui/Table/DataTable";
import { DealType, PermissionEnum } from "@prisma/client";
import { columnsDataProjectSummary } from "../[userId]/model/summary-columns-data-project";
import { useGetAllProjects } from "@/entities/deal/hooks/query";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";

const SummaryTableProject = ({ userId }: { userId: string }) => {
  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_UNION_REPORT
  );

  const {
    data: deals,
    error,
    isError,
    // isPending,
  } = useGetAllProjects(hasAccess ? (userId as string) : null);

  const getRowLink = useCallback(
    (row: ProjectResponse & { id: string }, type: string) => {
      return `/deal/${type.toLowerCase()}/${row.id}`;
    },
    []
  );

  //   if (isPending) return <Loading />;

  return (
    <DealTableTemplate>
      {isError && (
        <div className="grid h-full place-items-center">
          <h1 className="rounded-md bg-muted p-4 text-center text-xl">
            {error?.message}
          </h1>
        </div>
      )}
      {deals && (
        <DataTable
          columns={columnsDataProjectSummary}
          data={(deals as ProjectResponse[]) ?? []}
          getRowLink={getRowLink}
          type={DealType.PROJECT}
        />
      )}
    </DealTableTemplate>
  );
};

export default SummaryTableProject;
