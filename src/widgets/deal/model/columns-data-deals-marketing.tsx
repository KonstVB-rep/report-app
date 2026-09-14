"use client"

import type { ReactNode } from "react"
import type { User } from "@prisma/client"
import type { CellContext, ColumnDef } from "@tanstack/react-table"
import { endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { DealUnion } from "@/entities/deal/types"
import useStoreDepartment from "@/entities/department/store/useStoreDepartment"
import { DealTypeLabels } from "@/feature/deals/lib/constants"
import RowNumber from "@/shared/lib/tanstack-table/columnsDataColsTemplate/RowNumber"

export const columnsDataDealsMarketing: ColumnDef<DealUnion, unknown>[] = [
  {
    ...RowNumber<DealUnion>(),
  },
  {
    id: "id",
    header: "ID",
    cell: (info) => info.getValue(),
    enableHiding: true,
    meta: {
      hidden: true,
    },
    accessorFn: (row: DealUnion) => row.id,
  },
  {
    id: "dateRequest",
    header: "Дата заявки",
    cell: (info: CellContext<DealUnion, unknown>) => {
      const date = info.getValue() as Date
      return date.toLocaleDateString("ru-RU")
    },
    enableHiding: false,
    meta: {
      isDateFilter: true,
      title: "Дата заявки",
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
    enableResizing: false,
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId) as Date
      const dateAtStartOfDay = startOfDay(date)

      if (filterValue) {
        const { from, to } = filterValue as DateRange

        if (from && to) {
          const toAtEndOfDay = endOfDay(to)
          return dateAtStartOfDay >= startOfDay(from) && dateAtStartOfDay <= toAtEndOfDay
        }

        if (from) {
          return dateAtStartOfDay >= startOfDay(from)
        }
        if (to) {
          return dateAtStartOfDay <= endOfDay(to)
        }
        return false
      }

      return true
    },
    accessorFn: (row: DealUnion) => row.dateRequest,
  },
  {
    id: "type",
    header: "Тип",
    cell: (info: CellContext<DealUnion, unknown>) => {
      const value = info.getValue() as keyof typeof DealTypeLabels
      return DealTypeLabels[value]
    },
    minSize: 100,
    maxSize: 100,
    meta: {
      title: "Тип",
    },
    enableHiding: true,
    accessorFn: (row: DealUnion) => row.type,
  },
  {
    id: "nameDeal",
    header: "Название сделки",
    cell: (info: CellContext<DealUnion, unknown>) => {
      const value = info.getValue() as ReactNode
      return value
    },
    meta: {
      title: "Название сделки",
    },
    enableHiding: true,
    accessorFn: (row: DealUnion) => row.nameDeal,
  },
  {
    id: "nameObject",
    header: "Название объекта",
    cell: (info: CellContext<DealUnion, unknown>) => {
      const value = info.getValue() as ReactNode
      return value
    },
    meta: {
      title: "Название объекта",
    },
    enableHiding: true,
    accessorFn: (row: DealUnion) => row.nameObject,
  },
  {
    id: "comments",
    header: "Комментарии",
    cell: (info: CellContext<DealUnion, unknown>) => {
      const value = info.getValue() as ReactNode
      return value
    },
    meta: {
      title: "Комментарии",
    },
    minSize: 300,
    enableHiding: true,
    accessorFn: (row: DealUnion) => row.comments,
  },
  {
    id: "resource",
    header: "Ресурс",
    cell: (info) => {
      const value = info.getValue() as ReactNode
      return value
    },
    enableHiding: true,
    meta: {
      title: "Ресурс",
    },
    accessorFn: (row: DealUnion) => row.resource,
  },
  {
    id: "employee",
    header: "Менеджер",
    cell: (info) => {
      const value = info.getValue() as keyof User

      const { deptsFormatted } = useStoreDepartment.getState()

      let userName = ""
      if (!deptsFormatted) return

      for (const dep of deptsFormatted) {
        const isFinded = dep.users[value] ?? false

        if (isFinded) {
          userName = dep.users[value]
        }
      }
      return <span className="capitalize">{userName}</span>
    },
    filterFn: (row, _, filterValues) => {
      if (!filterValues || filterValues.length === 0) {
        return true
      }

      const userIdOfProject = row.original.userId
      return filterValues.includes(userIdOfProject)
    },
    meta: {
      title: "Менеджер",
    },
    accessorFn: (row: DealUnion) => row.userId,
  },
]
