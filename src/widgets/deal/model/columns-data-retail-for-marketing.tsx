"use client"

import type { CellContext, ColumnDef } from "@tanstack/react-table"
import { endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { RetailResponse } from "@/entities/deal/types"
import {
  DeliveryRetailLabels,
  DirectionRetailLabels,
  StatusRetailLabels,
} from "@/feature/deals/lib/constants"
import RowNumber from "@/shared/lib/tanstack-table/columnsDataColsTemplate/RowNumber"
import { formatterCurrency } from "@/shared/lib/utils"

export type typeofDirections = keyof typeof DirectionRetailLabels

export type typeofDelivery = keyof typeof DeliveryRetailLabels

export type typeofStatus = keyof typeof StatusRetailLabels

export const columnsDataRetailForMarketing: ColumnDef<RetailResponse, unknown>[] = [
  {
    ...RowNumber<RetailResponse>(),
  },
  {
    id: "id",
    enableHiding: false,
    meta: {
      isNotSearchable: true,
      hidden: true,
      title: "id",
    },
  },
  {
    id: "dateRequest",
    accessorKey: "dateRequest",
    header: "Дата заявки",
    cell: (info: CellContext<RetailResponse, unknown>) => {
      const value = info.getValue()

      if (value instanceof Date) {
        return value.toLocaleDateString("ru-RU")
      }

      if (typeof value === "string") {
        const date = new Date(value)
        if (!Number.isNaN(date.getTime())) {
          return date.toLocaleDateString("ru-RU")
        }
        return "-"
      }

      return "-"
    },
    enableHiding: true,
    meta: {
      isDateFilter: true,
      title: "Дата заявки",
    },
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
    accessorFn: (row: RetailResponse) => row.dateRequest,
  },
  {
    id: "nameDeal",
    accessorKey: "nameDeal",
    header: "Название сделки",
    cell: (info: CellContext<RetailResponse, unknown>) => info.getValue(),
    enableHiding: true,
    meta: {
      title: "Название сделки",
    },
    accessorFn: (row: RetailResponse) => row.nameDeal,
  },
  {
    id: "nameObject",
    accessorKey: "nameObject",
    header: "Название объекта/Город",
    cell: (info: CellContext<RetailResponse, unknown>) => info.getValue(),
    enableHiding: true,
    meta: {
      title: "Название объекта/Город",
    },
    accessorFn: (row: RetailResponse) => row.nameObject,
  },
  {
    id: "direction",
    accessorKey: "direction",
    header: "Направление",
    cell: (info: CellContext<RetailResponse, unknown>) => {
      const value = info.getValue() as typeofDirections
      return <span>{DirectionRetailLabels[value]}</span>
    },
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId)
      if (!rowValue) return false
      if (Array.isArray(value)) {
        return value.some((direction) => (rowValue as typeofDirections).includes(direction))
      }
      return rowValue === value
    },
    enableHiding: false,
    meta: {
      hidden: true,
      title: "Направление",
    },
    accessorFn: (row: RetailResponse) => row.direction,
  },
  {
    id: "deliveryType",
    accessorKey: "deliveryType",
    header: "Тип поставки",
    cell: (info: CellContext<RetailResponse, unknown>) => {
      const value = info.getValue() as typeofDelivery
      return <span>{DeliveryRetailLabels[value]}</span>
    },
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId)

      if (!rowValue) return false
      if (Array.isArray(value)) {
        return value.includes(rowValue)
      }
      return rowValue === value
    },
    enableHiding: false,
    meta: {
      hidden: true,
      title: "Тип поставки",
    },
    accessorFn: (row: RetailResponse) => row.deliveryType,
  },
  {
    id: "amountCP",
    accessorKey: "amountCP",
    header: "Сумма",
    cell: (info: CellContext<RetailResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    meta: {
      title: "Сумма",
    },
    accessorFn: (row: RetailResponse) => row.amountCP,
  },
  {
    id: "dealStatus",
    accessorKey: "dealStatus",
    header: "Статус",
    cell: (info: CellContext<RetailResponse, unknown>) => {
      const value = info.getValue() as typeofStatus
      return <span className="whitespace-nowrap">{StatusRetailLabels[value]}</span>
    },
    enableHiding: true,
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId)
      if (Array.isArray(value)) {
        return value.includes(rowValue)
      }
      return rowValue === value
    },
    meta: {
      title: "Статус",
    },
    accessorFn: (row: RetailResponse) => row.dealStatus,
  },
  {
    id: "comments",
    accessorKey: "comments",
    header: "Комментарии",
    size: 300,
    minSize: 300,
    cell: (info: CellContext<RetailResponse, unknown>) => info.getValue(), //тег
    enableSorting: false,
    enableHiding: true,
    meta: {
      title: "Комментарии",
    },
    accessorFn: (row: RetailResponse) => row.comments,
  },
  {
    id: "resource",
    header: "Ресурс",
    cell: (info) => info.getValue(),
    enableHiding: true,
    meta: {
      title: "Ресурс",
    },
    accessorFn: (row: RetailResponse) => row.resource,
  },
]
