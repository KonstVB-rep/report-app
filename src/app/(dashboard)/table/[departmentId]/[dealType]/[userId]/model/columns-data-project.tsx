"use client";

import {
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusProjectLabels,
} from "@/entities/deal/lib/constants";
import { ProjectResponse, StatusType } from "@/entities/deal/types";
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
    // filterFn: (row, columnId, filterValue) => {
    //   const date = row.getValue(columnId) as Date;
    //   const dateAtStartOfDay = startOfDay(date);

    //   let parsedFilterValue = filterValue;
    //   if (typeof filterValue === 'string') {
    //     try {
    //       parsedFilterValue = JSON.parse(filterValue);
    //     } catch (e) {
    //       console.error('Ошибка при парсинге filterValue', e);
    //       parsedFilterValue = null;
    //     }
    //   }

    //   if (parsedFilterValue) {
    //     const { from, to } = parsedFilterValue as DateRange;

    //     if (from && to) {
    //       const toAtEndOfDay = endOfDay(to);
    //       return (
    //         dateAtStartOfDay >= startOfDay(from) &&
    //         dateAtStartOfDay <= toAtEndOfDay
    //       );
    //     }

    //     if (from) {
    //       return dateAtStartOfDay >= startOfDay(from);
    //     }
    //     if (to) {
    //       return dateAtStartOfDay <= endOfDay(to);
    //     }
    //     return false;
    //   }

    //   return true;
    // },
    accessorFn: (row: ProjectResponse) => row.dateRequest,
  },
  {
    id: "nameDeal",
    header: "Название сделки",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.nameDeal,
  },
  {
    id: "nameObject",
    header: "Название объекта",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.nameObject,
  },
  {
    id: "direction",
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
    meta: {
      isMultiSelect: true,
    },
    accessorFn: (row: ProjectResponse) => row.direction,
  },
  {
    id: "deliveryType",
    header: "Тип поставки",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as typeofDelivery;
      return <span>{DeliveryProjectLabels[value]}</span>;
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || !Array.isArray(filterValue)) return true;
      const rowValue = row.getValue(columnId);

      if (!rowValue) return false; // Проверяем, есть ли значение в ячейке

      if (Array.isArray(filterValue)) {
        return filterValue.some(
          (direction) => String(rowValue).includes(direction) // Приводим rowValue к строке, чтобы избежать ошибок
        );
      }

      return rowValue === filterValue;
    },
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.deliveryType,
  },
  {
    id: "contact",
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
    header: "Email",
    cell: (info: CellContext<ProjectResponse, unknown>) => (
      <span className="whitespace-nowrap">{info.getValue() as string}</span>
    ),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.email,
  },
  {
    id: "additionalContact",
    header: "Дополнительный контакт",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.additionalContact,
  },
  {
    id: "amountCP",
    header: "Сумма КП",
    cell: (info: CellContext<ProjectResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.amountCP,
  },
  {
    id: "amountWork",
    header: "Сумма работ",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.amountWork,
  },
  {
    id: "amountPurchase",
    header: "Сумма закупки",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.amountPurchase,
  },
  {
    id: "delta",
    header: "Дельта",
    cell: (info: CellContext<ProjectResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.delta,
  },
  {
    id: "dealStatus",
    header: "Статус",
    cell: (info: CellContext<ProjectResponse, unknown>) => {
      const value = info.getValue() as typeofStatus;
      return (
        <span className="whitespace-nowrap">{StatusProjectLabels[value]}</span>
      );
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
    accessorFn: (row: ProjectResponse) => row.dealStatus,
  },
  {
    id: "comments",
    header: "Комментарии",
    cell: (info: CellContext<ProjectResponse, unknown>) => info.getValue(), //тег
    enableSorting: false,
    enableHiding: true,
    accessorFn: (row: ProjectResponse) => row.comments,
  },
  {
    id: "plannedDateConnection",
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
