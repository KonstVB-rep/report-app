"use client";

import { useGetProjectsUser } from "@/entities/deal/hooks/query";
import { ProjectResponse } from "@/entities/deal/types";
import { DealType, PermissionEnum } from "@prisma/client";
import { columnsDataProject } from "../[userId]/model/columns-data-project";
import PersonTable from "./PersonTable";
import AccessDeniedMessage from "@/shared/ui/AccessDeniedMessage";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";

const PersonTableProject = ({ userId }: { userId: string }) => {
  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT
  );

  const { data: deals } = useGetProjectsUser(
    hasAccess ? (userId as string) : null
  );

  if (!hasAccess)
    return (
      <AccessDeniedMessage
        error={{ message: "у вас нет доступа к этому разделу" }}
      />
    );

  const getRowLink = (row: ProjectResponse) => `/deal/project/${row.id}`;

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
