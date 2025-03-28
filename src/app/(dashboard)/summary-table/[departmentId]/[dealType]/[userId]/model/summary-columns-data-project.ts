"use client";

import { columnsDataProject } from "@/app/(dashboard)/table/[departmentId]/[dealType]/[userId]/model/columns-data-project";
import { ProjectResponse } from "@/entities/deal/types";
import { ColumnDef } from "@tanstack/react-table";

export const columnsDataProjectSummary: ColumnDef<ProjectResponse, unknown>[] =
  [
    ...columnsDataProject,
    {
      id: "user",
      header: "Менеджер",
      cell: (info) => info.getValue(),
      enableHiding: true,
      filterFn: (row, columnId, filterValues) => {
        if (!filterValues || filterValues.length === 0) {
          return true;
        }

        const userIdOfProject = row.original.userId;
        return filterValues.includes(userIdOfProject);
      },
      accessorFn: (row: ProjectResponse) => row.userId,
    },
  ];
