"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { ProjectResponse } from "@/entities/deal/types"
import { getUsers } from "@/entities/department/lib/utils"
import { columnsDataProject } from "@/widgets/deal/model/columns-data-project"

const users = getUsers({ onlyManagers: true })

export const columnsDataProjectSummary: ColumnDef<ProjectResponse, unknown>[] = [
  ...columnsDataProject,
  {
    id: "user",
    header: "Менеджер",
    cell: (info) => {
      const userId: string = info.getValue() as string
      return users[userId]
    },
    enableHiding: true,
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
    accessorFn: (row: ProjectResponse) => row.userId,
  },
]
