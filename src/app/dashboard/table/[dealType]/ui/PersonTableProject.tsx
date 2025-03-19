'use client';
import { useGetProjectsUser } from "@/entities/deal/hooks";
import { ProjectResponse } from "@/entities/deal/types";
import { DealType } from "@prisma/client";
import { useParams } from "next/navigation";
import { columnsDataProject } from "../[userId]/model/columns-data-project";
import PersonTable from "./PersonTable";

const PersonTableProject = () => {
  const { userId } = useParams();
  const { data: projects } = useGetProjectsUser(userId as string);

  const getRowLink = (row: ProjectResponse) => `/dashboard/deal/project/${row.id}`;

  return <PersonTable data={projects ?? []} type={DealType.PROJECT} columns={columnsDataProject} getRowLink={getRowLink} />;
};

export default PersonTableProject;