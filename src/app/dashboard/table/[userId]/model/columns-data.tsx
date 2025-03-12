"use client";

import {
  DeliveryLabels,
  DirectionLabels,
  StatusLabels,
} from "@/entities/project/lib/constants";
import { ProjectResponse, StatusType } from "@/entities/project/types";
import { formatterCurrency } from "@/shared/lib/utils";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { endOfDay, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

export type typeofDirections = keyof typeof DirectionLabels;

export type typeofDelivery = keyof typeof DeliveryLabels;

export type typeofStatus = keyof typeof StatusLabels;

export const columnsData: ColumnDef<ProjectResponse, unknown>[] = [
  {
    id: "rowNumber",
    header: "№",
    cell: ({ row }) => row.index + 1,
    enableHiding: false,
    enableSorting: false,
    accessorFn: () => "",
  },
  {
    id: "dateRequest",
    accessorKey: "dateRequest",
    header: "Дата заявки",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const date = info.getValue() as Date;
      return date.toLocaleDateString("ru-RU");
    },
    enableHiding: true,
    meta: {
      isDateFilter: true,
    },
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId) as Date;
      const dateAtStartOfDay = startOfDay(date);

      if (filterValue) {
        const { from, to } = filterValue as DateRange;

        if (from && to) {
          const toAtEndOfDay = endOfDay(to);
          return (
            dateAtStartOfDay >= startOfDay(from) &&
            dateAtStartOfDay <= toAtEndOfDay
          );
        }

        if (from) {
          return dateAtStartOfDay >= startOfDay(from);
        }
        if (to) {
          return dateAtStartOfDay <= endOfDay(to);
        }
        return false;
      }

      return true;
    },
    accessorFn: (row: ProjectResponse) => row.dateRequest,
  },
  {
    id: "equipment_type",
    accessorKey: "equipment_type",
    header: "Тип оборудования/работ",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.equipment_type,
  },
  {
    id: "nameObject",
    accessorKey: "nameObject",
    header: "Название объекта",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.nameObject,
  },
  {
    id: "direction",
    accessorKey: "direction",
    header: "Направление",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as typeofDirections;
      return <span>{DirectionLabels[value]}</span>;
    },
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      if (Array.isArray(value)) {
        return value.some((direction) =>
          (rowValue as typeofDirections).includes(direction)
        );
      }
      return rowValue === value;
    },
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.direction,
  },
  {
    id: "deliveryType",
    accessorKey: "deliveryType",
    header: "Тип поставки",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as typeofDelivery;
      return <span>{DeliveryLabels[value]}</span>;
    },
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      if (Array.isArray(value)) {
        return value.some((direction) =>
          (rowValue as typeofDirections).includes(direction)
        );
      }
      return rowValue === value;
    },
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.deliveryType,
  },
  {
    id: "contact",
    accessorKey: "contact",
    header: "Контактное лицо",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.contact,
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Телефон",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      return (
        <span className="whitespace-nowrap">{info.getValue() as string}</span> //тег
      );
    },
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.phone,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: (info: CellContext<ProjectResponse, unknown>) => (
      <span className="whitespace-nowrap">{info.getValue() as string}</span>
    ),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.email,
  },
  {
    id: "amountCo",
    accessorKey: "amountCo",
    header: "Сумма",
    cell: (info: CellContext<ProjectResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.amountCo,
  },
  {
    id: "delta",
    accessorKey: "delta",
    header: "Дельта",
    cell: (info: CellContext<ProjectResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.delta,
  },
  {
    id: "project_status",
    accessorKey: "project_status",
    header: "Статус",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as typeofStatus;
      return <span className="whitespace-nowrap">{StatusLabels[value]}</span>;
    },
    enableHiding: true,
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      if (Array.isArray(value)) {
        return value.some((status) =>
          (rowValue as StatusType).includes(status)
        );
      }
      return rowValue === value;
    },
    accessorFn: (row: ProjectResponse) => row.project_status,
  },
  {
    id: "comments",
    accessorKey: "comments",
    header: "Комментарии",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(), //тег
    enableSorting: false,
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.comments,
  },
  {
    id: "lastDateConnection",
    accessorKey: "lastDateConnection",
    header: "Дата последнего контакта",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const date = info.getValue() as Date;
      return date.toLocaleDateString("ru-RU");
    },
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.lastDateConnection,
  },
  {
    id: "plannedDateConnection",
    accessorKey: "plannedDateConnection",
    header: "Плановая дата контакта",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const date = info.getValue() as Date;
      return date.toLocaleDateString("ru-RU");
    },
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.plannedDateConnection,
  },
];
