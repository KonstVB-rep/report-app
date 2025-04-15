"use client";

import { ColumnDef } from "@tanstack/react-table";

import { columnsDataProject } from "@/app/(dashboard)/table/[departmentId]/[dealType]/[userId]/model/columns-data-project";
import { ProjectResponse } from "@/entities/deal/types";

export const columnsDataProjectSummary: ColumnDef<ProjectResponse, unknown>[] =
  [
    ...columnsDataProject,
    {
      id: "user",
      header: "Менеджер",
      cell: (info) => info.getValue(),
      enableHiding: true, // Разрешает скрывать колонку
      meta: {
        hidden: true, // Изначально скрыта
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
