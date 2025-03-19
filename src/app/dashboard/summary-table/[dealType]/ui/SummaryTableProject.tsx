'use client';

import React from "react";
import { useParams } from "next/navigation";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import { ProjectResponse } from "@/entities/deal/types";
import DataTable from "@/shared/ui/Table/DataTable";
import { DealType } from "@prisma/client";
import { columnsDataProjectSummary } from "../[userId]/model/summary-columns-data-project";
import { useGetAllDealsByDepartmentByType } from "@/entities/deal/hooks";

const SummaryTableProject = () => {
  const { userId } = useParams();


  // const {
  //   data: dealsByType,
  //   error,
  //   isError,
  //   // isPending,
  // } = useQuery({
  //   queryKey: ["all-projects", authUser?.departmentId],
  //   queryFn: async () => {
  //     try {
  //       return await getAllProjectsByDepartment();
  //     } catch (error) {
  //       console.log(error);
  //       TOAST.ERROR((error as Error).message);
  //       throw error;
  //     }
  //   },
  //   enabled: !!userId && !!authUser?.departmentId,
  //   refetchOnWindowFocus: false,
  //   retry: 2,
  // });

  const {
    data: dealsByType,
    error,
    isError,
    // isPending,
  } = useGetAllDealsByDepartmentByType(userId as string, DealType.PROJECT);

  const getRowLink = (row: ProjectResponse & { id: string }, type: string) => {
    return `/dashboard/deal/${type.toLowerCase()}/${row.id}`;
  };

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
          getRowLink={getRowLink} type={DealType.PROJECT}        />
      )}
    </DealTableTemplate>
  );
};

export default SummaryTableProject;