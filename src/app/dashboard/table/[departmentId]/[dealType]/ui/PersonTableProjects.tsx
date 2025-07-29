"use client";

import { DealType, PermissionEnum } from "@prisma/client";

import dynamic from "next/dynamic";

import { useGetProjectsUser } from "@/entities/deal/hooks/query";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";
import { DealBase } from "@/shared/ui/Table/model/types";

import { columnsDataProject } from "../[userId]/model/columns-data-project";
import PersonTable from "./PersonTable";

const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

const PersonTableProject = ({ userId }: { userId: string }) => {
  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT
  );

  const { data: deals } = useGetProjectsUser(
    hasAccess ? (userId as string) : undefined
  );

  const getRowLink = (row: DealBase) => `/deal/project/${row.id}`;

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
