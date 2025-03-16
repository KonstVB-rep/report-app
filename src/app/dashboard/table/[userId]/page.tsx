"use client";

import React, { RefObject } from "react";
import { columnsDataProject } from "./model/columns-data-project";
import DataTable from "@/shared/ui/Table/DataTable";
import AddNewProject from "@/entities/project/ui/Modals/AddNewDeal";
import { getProjectsUser } from "@/entities/project/api";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useScrollIntoViewBlock from "@/shared/hooks/useScrollIntoViewBlock";
import Loading from "./loading";
import ProjectTableTemplate from "@/entities/project/ui/ProjectTableTemplate";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/entities/user/ui/Toast";
import { ProjectResponse } from "@/entities/project/types";
import SummaryTableLink from "@/entities/department/ui/SummaryTableLink";
// import UploadExcel from "@/shared/ui/UploadExcel";

const PersonTable = () => {
  const { userId } = useParams();
  const { authUser } = useStoreUser();
  const isPageAuthuser = userId === authUser?.id;

  const {
    data: projects,
    isError,
    isPending: isPendingProjects,
  } = useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => {
      try {
        return await getProjectsUser(userId as string);
      } catch (error) {
        if (!isError) TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const ref = useScrollIntoViewBlock(
    projects
  ) as unknown as RefObject<HTMLDivElement>;

const getRowLink = (row: ProjectResponse & { id: string }, type: string) => {
    return `/dashboard/deal/${type}/${row.id}`;
  };

  if (isPendingProjects) return <Loading />;

  return (
    <ProjectTableTemplate ref={ref}>
      <>
        {isPageAuthuser && (
          <div className="flex items-center justify-between">
            <AddNewProject />
            {/* <UploadExcel/> */}
            <SummaryTableLink />
          </div>
        )}
        <DataTable
          columns={columnsDataProject}
          data={projects ?? []}
          getRowLink={getRowLink}
        />
      </>
    </ProjectTableTemplate>
  );
};

export default PersonTable;
