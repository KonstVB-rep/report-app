"use client";

import { useGetProjectsUser } from "@/entities/deal/hooks/query";
import { ProjectResponse } from "@/entities/deal/types";
import { DealType, PermissionEnum } from "@prisma/client";
import { columnsDataProject } from "../[userId]/model/columns-data-project";
import PersonTable from "./PersonTable";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import useRedirectToLoginNotAuthUser from "@/shared/hooks/useRedirectToLoginNotAuthUser";
import dynamic from "next/dynamic";
import { useCallback } from "react";

const AccessDeniedMessage = dynamic(() => import("@/shared/ui/AccessDeniedMessage"), { ssr: false });

const PersonTableProject = ({ userId }: { userId: string }) => {
  useRedirectToLoginNotAuthUser();

  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT
  );

  const { data: deals } = useGetProjectsUser(
    hasAccess ? (userId as string) : null
  );

  const getRowLink = useCallback((row: ProjectResponse) => `/deal/project/${row.id}`,[]);

  if (!hasAccess)
    return (
      <AccessDeniedMessage
        error={{ message: "у вас нет доступа к этому разделу" }}
      />
    );


  return (
    <PersonTable
      data={deals ?? []}
      type={DealType.PROJECT}
      columns={columnsDataProject}
      getRowLink={getRowLink}
    />
  );
};

export default PersonTableProject;
