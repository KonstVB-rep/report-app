"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { RetailResponse } from "@/entities/deal/types"
import { getUsers } from "@/entities/department/lib/utils"
import { columnsDataRetail } from "@/widgets/deal/model/columns-data-retail"

const users = getUsers({ onlyManagers: true })

export const columnsDataRetailSummary: ColumnDef<RetailResponse, unknown>[] = [
  ...columnsDataRetail,
  {
    id: "user",
    header: "Менеджер",
    cell: (info) => {
      const userId: string = info.getValue() as string
      return users[userId]
    },
    enableHiding: false,
    meta: {
      title: "Менеджер",
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
