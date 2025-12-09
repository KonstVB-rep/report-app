"use client"

import { StatusRetail } from "@prisma/client"
import type { CellContext, ColumnDef } from "@tanstack/react-table"
import { endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { RetailResponse } from "@/entities/deal/types"
import {
  DeliveryRetailLabels,
  DirectionRetailLabels,
  StatusRetailLabels,
} from "@/feature/deals/lib/constants"
import { formatterCurrency } from "@/shared/lib/utils"
import RowNumber from "./columnsDataColsTemplate/RowNumber"

export type typeofDirections = keyof typeof DirectionRetailLabels

export type typeofDelivery = keyof typeof DeliveryRetailLabels

export type typeofStatus = keyof typeof StatusRetailLabels

export const columnsDataRetail: ColumnDef<RetailResponse, unknown>[] = [
  {
    ...RowNumber<RetailResponse>(),
    meta: {
      title: "№",
    },
  },
  {
    id: "id",
    enableHiding: false,
    meta: {
      isNotSearchable: true,
      hidden: true,
      // title не добавляем — нет header
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
    id: "plannedDateConnection",
    accessorKey: "plannedDateConnection",
    header: "Плановая дата контакта",
    cell: (info: CellContext<RetailResponse, unknown>) => {
      const value = info.getValue() as Date | null

      if (!value) return "Дата не указана"

      if (value instanceof Date) return value.toLocaleDateString("ru-RU")

      if (typeof value === "string") {
        const parsed = new Date(value)
        if (!Number.isNaN(parsed.getTime())) {
          return parsed.toLocaleDateString("ru-RU")
        }
        return "Дата не указана"
      }

      return "Дата не указана"
    },
    enableHiding: true,
    meta: {
      title: "Плановая дата контакта",
    },
    filterFn: (row, columnId, filterValue) => {
      if (row.original.dealStatus === StatusRetail.REJECT) return false

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
    accessorFn: (row: RetailResponse) => row.plannedDateConnection,
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
    enableHiding: true,
    meta: {
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
    enableHiding: true,
    meta: {
      title: "Тип поставки",
    },
    accessorFn: (row: RetailResponse) => row.deliveryType,
  },
  {
    id: "contact",
    accessorKey: "contact",
    header: "Контактное лицо",
    cell: (info: CellContext<RetailResponse, unknown>) => info.getValue(),
    enableHiding: true,
    meta: {
      title: "Контактное лицо",
    },
    accessorFn: (row: RetailResponse) => row.contact,
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Телефон",
    cell: (info: CellContext<RetailResponse, unknown>) => (
      <span className="whitespace-nowrap">{info.getValue() as string}</span>
    ),
    enableHiding: true,
    meta: {
      title: "Телефон",
    },
    accessorFn: (row: RetailResponse) => row.phone,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: (info: CellContext<RetailResponse, unknown>) => (
      <span className="whitespace-nowrap">{info.getValue() as string}</span>
    ),
    enableHiding: true,
    meta: {
      title: "Email",
    },
    accessorFn: (row: RetailResponse) => row.email,
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
    id: "delta",
    accessorKey: "delta",
    header: "Дельта",
    cell: (info: CellContext<RetailResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    meta: {
      title: "Дельта",
    },
    accessorFn: (row: RetailResponse) => row.delta,
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
    cell: (info: CellContext<RetailResponse, unknown>) => info.getValue(),
    enableSorting: false,
    enableHiding: true,
    meta: {
      title: "Комментарии",
    },
    accessorFn: (row: RetailResponse) => row.comments,
  },
  {
    id: "resource",
    accessorKey: "resource",
    header: "Источник/Сайт",
    cell: (info: CellContext<RetailResponse, unknown>) => info.getValue(),
    enableHiding: false,
    meta: {
      hidden: true,
      title: "Источник/Сайт",
    },
    accessorFn: (row: RetailResponse) => row.resource,
  },
]
