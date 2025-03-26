"use client";

import { columnsDataRetail } from "@/app/(dashboard)/table/[departmentId]/[dealType]/[userId]/model/columns-data-retail";
import { RetailResponse } from "@/entities/deal/types";
import { ColumnDef } from "@tanstack/react-table";

export const columnsDataRetailSummary: ColumnDef<RetailResponse, unknown>[] = [
  ...columnsDataRetail,
  {
    id: "user",
    header: "Менеджер",
    cell: (info) => info.getValue(),
    enableHiding: false,
    meta: {
      hidden: true,
    },
    filterFn: (row, columnId, filterValues) => {
      console.log("filterValues", filterValues);
      if (!filterValues || filterValues.length === 0) {
        return true;
      }

      const userIdOfProject = row.original.userId;
      return filterValues.includes(userIdOfProject);
    },
    accessorFn: (row: RetailResponse) => row.userId,
  },
];
