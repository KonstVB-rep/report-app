"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import { useCallback } from "react";

import dynamic from "next/dynamic";

import { useGetProjectsUser } from "@/entities/deal/hooks/query";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import { ProjectResponse } from "@/entities/deal/types";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import { columnsDataProject } from "../[userId]/model/columns-data-project";
import PersonTable from "./PersonTable";import Loading from "../[userId]/loading";
;

const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

const PersonTableProject = ({ userId }: { userId: string }) => {
  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT
  );

  const { data: deals, isPending } = useGetProjectsUser(
    hasAccess ? (userId as string) : null
  );

  const getRowLink = useCallback(
    (row: ProjectResponse) => `/deal/project/${row.id}`,
    []
  );

  if (isPending) return <Loading />;

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

export default withAuthGuard(PersonTableProject);
