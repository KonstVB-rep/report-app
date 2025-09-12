"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ProjectResponse } from "@/entities/deal/types";
import { columnsDataProject } from "@/widgets/deal/model/columns-data-project";

export const columnsDataProjectSummary: ColumnDef<ProjectResponse, unknown>[] =
  [
    ...columnsDataProject,
    {
      id: "user",
      header: "Менеджер",
      cell: (info) => info.getValue(),
      enableHiding: true, 
      meta: {
        hidden: true,
      },
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
