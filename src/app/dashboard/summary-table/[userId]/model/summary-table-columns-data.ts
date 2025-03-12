"use client";

import { columnsData } from "@/app/dashboard/table/[userId]/model/columns-data";
import { ProjectResponse,  } from "@/entities/project/types";
import { ColumnDef } from "@tanstack/react-table";


export const columnsDataSummary: ColumnDef<ProjectResponse, unknown>[] = [
  ...columnsData,
  {
    id: "user",
    accessorKey: "user",
    header: "Менеджер проекта",
    cell: (info) =>  info.getValue(),
    enableHiding: true,
    filterFn:(row, columnId, filterValues) => {
        if(!filterValues || filterValues.length === 0) {
            return true;
        }

        const userIdOfProject = row.original.userId;
        return filterValues.includes(userIdOfProject);
    },
    accessorFn: (row: ProjectResponse) => row.userId,
  },
];
