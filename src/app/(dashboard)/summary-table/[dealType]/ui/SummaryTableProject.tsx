"use client";

import React, { useCallback } from "react";
import { useParams } from "next/navigation";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import { ProjectResponse } from "@/entities/deal/types";
import DataTable from "@/shared/ui/Table/DataTable";
import { DealType } from "@prisma/client";
import { columnsDataProjectSummary } from "../[userId]/model/summary-columns-data-project";
import { useGetAllDealsByDepartmentByType } from "@/entities/deal/hooks";

const SummaryTableProject = () => {
  const { userId } = useParams();

  const {
    data: dealsByType,
    error,
    isError,
    // isPending,
  } = useGetAllDealsByDepartmentByType(userId as string, DealType.PROJECT);

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
        <div className="grid place-items-center h-full">
          <h1 className="text-xl text-center p-4 bg-muted rounded-md">
            {error?.message}
          </h1>
        </div>
      )}
      {dealsByType && (
        <DataTable
          columns={columnsDataProjectSummary}
          data={(dealsByType as ProjectResponse[]) ?? []}
          getRowLink={getRowLink}
          type={DealType.PROJECT}
        />
      )}
    </DealTableTemplate>
  );
};

export default SummaryTableProject;
