"use client";

import React from "react";
import { getAllProjectsByDepartment } from "@/entities/project/api";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Loading from "./loading";
import ProjectTableTemplate from "@/entities/project/ui/ProjectTableTemplate";

import { TOAST } from "@/entities/user/ui/Toast";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { columnsDataProjectSummary } from "./model/summary-table-columns-data";
import { ProjectResponse } from "@/entities/project/types";
import DataTable from "@/shared/ui/Table/DataTable";

const SummaryTable = () => {
  const { userId } = useParams();
  const { authUser } = useStoreUser();

  const {
    data: AllProject,
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
      {AllProject && (
        <DataTable
          columns={columnsDataProjectSummary}
          data={(AllProject as ProjectResponse[]) ?? []}
          getRowLink={getRowLink}
        />
      )}
    </ProjectTableTemplate>
  );
};

export default SummaryTable;
