"use client";

import {
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusProjectLabels,
} from "@/entities/project/lib/constants";
import { ProjectResponse, StatusType } from "@/entities/project/types";
import { formatterCurrency } from "@/shared/lib/utils";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { endOfDay, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";

export type typeofDirections = keyof typeof DirectionProjectLabels;

export type typeofDelivery = keyof typeof DeliveryProjectLabels;

export type typeofStatus = keyof typeof StatusProjectLabels;

export const columnsDataProject: ColumnDef<ProjectResponse, unknown>[] = [
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
    id: "equipmentType",
    accessorKey: "equipmentType",
    header: "Тип оборудования/работ",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.equipmentType,
  },
  {
    id: "nameDeal",
    accessorKey: "nameDeal",
    header: "Название сделки",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.nameObject,
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
      return <span>{DirectionProjectLabels[value]}</span>;
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
      return <span>{DeliveryProjectLabels[value]}</span>;
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
    id: "additionalСontact",
    accessorKey: "contact",
    header: "Дополнительный контакт",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.contact,
  },
  {
    id: "amountCP",
    accessorKey: "amountCP",
    header: "Сумма",
    cell: (info: CellContext<ProjectResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.amountCP,
  },
  {
    id: "amountWork",
    accessorKey: "amountWork",
    header: "Сумма работ",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.nameObject,
  },
  {
    id: "amountPurchase",
    accessorKey: "amountPurchase",
    header: "Сумма закупки",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.nameObject,
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
    id: "projectStatus",
    accessorKey: "projectStatus",
    header: "Статус",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as typeofStatus;
      return <span className="whitespace-nowrap">{StatusProjectLabels[value]}</span>;
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
    accessorFn: (row: ProjectResponse) => row.projectStatus,
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
    id: "plannedDateConnection",
    accessorKey: "plannedDateConnection",
    header: "Плановая дата контакта",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const date = info.getValue() as Date | null;

      if (date) {
        return date.toLocaleDateString("ru-RU");
      } else {
        return "Дата не указана";
      }
    },
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.plannedDateConnection,
  },
];
