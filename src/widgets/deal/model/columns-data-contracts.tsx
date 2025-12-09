"use client"

import type { ReactNode } from "react"
import type { CellContext, ColumnDef } from "@tanstack/react-table"
import { endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import type { ProjectResponse } from "@/entities/deal/types"
import {
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusContractLabels,
} from "@/feature/deals/lib/constants"
import { formatterCurrency } from "@/shared/lib/utils"
import RowNumber from "./columnsDataColsTemplate/RowNumber"

export type typeofDirections = keyof typeof DirectionProjectLabels

export type typeofDelivery = keyof typeof DeliveryProjectLabels

export type typeofStatus = keyof typeof StatusContractLabels

export const columnsDataContract: ColumnDef<ProjectResponse, unknown>[] = [
  {
    ...RowNumber<ProjectResponse>(),
    meta: {
      title: "№",
    },
  },
  {
    id: "dateRequest",
    header: "Дата заявки",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const date = info.getValue() as Date
      return date.toLocaleDateString("ru-RU")
    },
    enableHiding: true,
    meta: {
      isDateFilter: true,
      title: "Дата заявки",
    },
    size: 100,
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
    accessorFn: (row: ProjectResponse) => row.dateRequest,
  },
  {
    id: "nameDeal",
    header: "Название сделки",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as ReactNode
      return value
    },
    enableHiding: true,
    meta: {
      title: "Название сделки",
    },
    accessorFn: (row: ProjectResponse) => row.nameDeal,
  },
  {
    id: "nameObject",
    header: "Название объекта",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as ReactNode
      return value
    },
    enableHiding: true,
    meta: {
      title: "Название объекта",
    },
    accessorFn: (row: ProjectResponse) => row.nameObject,
  },
  {
    id: "direction",
    header: "Направление",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as typeofDirections
      return <span>{DirectionProjectLabels[value]}</span>
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
      isMultiSelect: true,
      title: "Направление",
    },
    accessorFn: (row: ProjectResponse) => row.direction,
  },
  {
    id: "deliveryType",
    header: "Тип поставки",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as typeofDelivery
      return <span>{DeliveryProjectLabels[value]}</span>
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || !Array.isArray(filterValue)) return true
      const rowValue = row.getValue(columnId)

      if (!rowValue) return false

      if (Array.isArray(filterValue)) {
        return filterValue.some((direction) => String(rowValue).includes(direction))
      }

      return rowValue === filterValue
    },
    enableHiding: true,
    meta: {
      title: "Тип поставки",
    },
    accessorFn: (row: ProjectResponse) => row.deliveryType,
  },
  {
    id: "contact",
    header: "Контактное лицо",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    meta: {
      title: "Контактное лицо",
    },
    accessorFn: (row: ProjectResponse) => row.contact,
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Телефон",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      return <span className="whitespace-nowrap">{info.getValue() as string}</span>
    },
    enableHiding: true,
    meta: {
      title: "Телефон",
    },
    accessorFn: (row: ProjectResponse) => row.phone,
  },
  {
    id: "email",
    header: "Email",
    cell: (info: CellContext<ProjectResponse, unknown>) => (
      <span className="whitespace-nowrap">{info.getValue() as string}</span>
    ),
    enableHiding: true,
    meta: {
      title: "Email",
    },
    accessorFn: (row: ProjectResponse) => row.email,
  },
  {
    id: "amountCP",
    header: "Сумма КП",
    cell: (info: CellContext<ProjectResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    meta: {
      title: "Сумма КП",
    },
    accessorFn: (row: ProjectResponse) => row.amountCP,
  },
  {
    id: "amountWork",
    header: "Сумма работ",
    cell: (info: CellContext<ProjectResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    meta: {
      title: "Сумма работ",
    },
    accessorFn: (row: ProjectResponse) => row.amountWork,
  },
  {
    id: "amountPurchase",
    header: "Сумма закупки",
    cell: (info: CellContext<ProjectResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    meta: {
      title: "Сумма закупки",
    },
    accessorFn: (row: ProjectResponse) => row.amountPurchase,
  },
  {
    id: "delta",
    header: "Дельта",
    cell: (info: CellContext<ProjectResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    meta: {
      title: "Дельта",
    },
    accessorFn: (row: ProjectResponse) => row.delta,
  },
  {
    id: "dealStatus",
    header: "Статус",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as typeofStatus
      return <span>{StatusContractLabels[value]}</span>
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
    accessorFn: (row: ProjectResponse) => row.dealStatus,
  },
  {
    id: "comments",
    header: "Комментарии",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as ReactNode
      return value
    },
    size: 300,
    minSize: 300,
    enableHiding: true,
    meta: {
      title: "Комментарии",
    },
    accessorFn: (row: ProjectResponse) => row.comments,
  },
]
