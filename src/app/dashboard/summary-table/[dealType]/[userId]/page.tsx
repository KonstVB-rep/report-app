"use client";

import React from "react";
import { getAllProjectsByDepartment } from "@/entities/deal/api";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Loading from "./loading";
import ProjectTableTemplate from "@/entities/deal/ui/DealTableTemplate";

import { TOAST } from "@/entities/user/ui/Toast";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { columnsDataProjectSummary } from "./model/summary-table-columns-data";
import { DealTypeEnums, ProjectResponse } from "@/entities/deal/types";
import DataTable from "@/shared/ui/Table/DataTable";

const SummaryTable = () => {
  const { dealType, userId } = useParams();
  const { authUser } = useStoreUser();

  const {
    data: dealsByType,
    error,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["all-projects", authUser?.departmentId],
    queryFn: async () => {
      try {
        return await getAllProjectsByDepartment();
      } catch (error) {
        console.log(error);
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId && !!authUser?.departmentId,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const getRowLink = (row: ProjectResponse & { id: string }, type: string) => {
    return `/dashboard/deal/${type}/${row.id}`;
  };

  if (isPending) return <Loading />;

  return (
    <ProjectTableTemplate>
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
          getRowLink={getRowLink} type={DealTypeEnums.PROJECT}        />
      )}
    </ProjectTableTemplate>
  );
};

export default SummaryTable;
