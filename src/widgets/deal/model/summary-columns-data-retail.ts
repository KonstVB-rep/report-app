"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { RetailResponse } from "@/entities/deal/types"
import { columnsDataRetail } from "@/widgets/deal/model/columns-data-retail"

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
    filterFn: (row, _, filterValues) => {
      if (!filterValues || filterValues.length === 0) {
        return true
      }

      const userIdOfProject = row.original.userId
      return filterValues.includes(userIdOfProject)
    },
    accessorFn: (row: RetailResponse) => row.userId,
  },
]
