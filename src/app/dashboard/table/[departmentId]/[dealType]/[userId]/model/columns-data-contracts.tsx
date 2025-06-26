"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";

import { ReactNode } from "react";
import { DateRange } from "react-day-picker";

import { endOfDay, startOfDay } from "date-fns";

import {
  DeliveryProjectLabels,
  DirectionProjectLabels,
  StatusContractLabels,
} from "@/entities/deal/lib/constants";
import { ContractResponse } from "@/entities/deal/types";
import { formatterCurrency } from "@/shared/lib/utils";

export type typeofDirections = keyof typeof DirectionProjectLabels;

export type typeofDelivery = keyof typeof DeliveryProjectLabels;

export type typeofStatus = keyof typeof StatusContractLabels;

export const columnsDataContract: ColumnDef<ContractResponse, unknown>[] = [
  {
    id: "rowNumber",
    header: "№",
    cell: ({ row }) => Number(row.index) + 1,
    enableHiding: false,
    enableSorting: false,
    accessorFn: () => "",
  },
  {
    id: "dateRequest",
    header: "Дата заявки",
    cell: (info: CellContext<ContractResponse, unknown>) => {
      const date = info.getValue() as Date;
      return date.toLocaleDateString("ru-RU");
    },
    enableHiding: true,
    meta: {
      isDateFilter: true,
    },
    size: 100, // Фиксированная ширина
    enableResizing: false, // Запрещаем изменение размера
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
    accessorFn: (row: ContractResponse) => row.dateRequest,
  },
  {
    id: "nameDeal",
    header: "Название сделки",
    cell: (info: CellContext<ContractResponse, unknown>) => {
      const value = info.getValue() as ReactNode;
      return <span className="line-clamp-2">{value}</span>;
    },
    enableHiding: true,
    accessorFn: (row: ContractResponse) => row.nameDeal,
  },
  {
    id: "nameObject",
    header: "Название объекта",
    cell: (info: CellContext<ContractResponse, unknown>) => {
      const value = info.getValue() as ReactNode;
      return <span className="line-clamp-2">{value}</span>;
    },
    enableHiding: true,
    accessorFn: (row: ContractResponse) => row.nameObject,
  },
  {
    id: "direction",
    header: "Направление",
    cell: (info: CellContext<ContractResponse, unknown>) => {
      const value = info.getValue() as typeofDirections;
      return <span>{DirectionProjectLabels[value]}</span>;
    },
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      if (!rowValue) return false;
      if (Array.isArray(value)) {
        return value.includes(rowValue);
      }
      return rowValue === value;
    },
    enableHiding: true,
    meta: {
      isMultiSelect: true,
    },
    accessorFn: (row: ContractResponse) => row.direction,
  },
  {
    id: "deliveryType",
    header: "Тип поставки",
    cell: (info: CellContext<ContractResponse, unknown>) => {
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
    accessorFn: (row: ContractResponse) => row.deliveryType,
  },
  {
    id: "contact",
    header: "Контактное лицо",
    cell: (info: CellContext<ContractResponse, unknown>) => info.getValue(),
    enableHiding: true,
    accessorFn: (row: ContractResponse) => row.contact,
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Телефон",
    cell: (info: CellContext<ContractResponse, unknown>) => {
      return (
        <span className="whitespace-nowrap">{info.getValue() as string}</span> //тег
      );
    },
    enableHiding: true,
    accessorFn: (row: ContractResponse) => row.phone,
  },
  {
    id: "email",
    header: "Email",
    cell: (info: CellContext<ContractResponse, unknown>) => (
      <span className="whitespace-nowrap">{info.getValue() as string}</span>
    ),
    enableHiding: true,
    accessorFn: (row: ContractResponse) => row.email,
  },
  {
    id: "amountCP",
    header: "Сумма КП",
    cell: (info: CellContext<ContractResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    accessorFn: (row: ContractResponse) => row.amountCP,
  },
  {
    id: "amountWork",
    header: "Сумма работ",
    cell: (info: CellContext<ContractResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    accessorFn: (row: ContractResponse) => row.amountWork,
  },
  {
    id: "amountPurchase",
    header: "Сумма закупки",
    cell: (info: CellContext<ContractResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    accessorFn: (row: ContractResponse) => row.amountPurchase,
  },
  {
    id: "delta",
    header: "Дельта",
    cell: (info: CellContext<ContractResponse, unknown>) =>
      formatterCurrency.format(parseFloat(info.getValue() as string)),
    enableHiding: true,
    accessorFn: (row: ContractResponse) => row.delta,
  },
  {
    id: "dealStatus",
    header: "Статус",
    cell: (info: CellContext<ContractResponse, unknown>) => {
      const value = info.getValue() as typeofStatus;
      return <span>{StatusContractLabels[value]}</span>;
    },
    enableHiding: true,
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      if (Array.isArray(value)) {
        return value.includes(rowValue);
      }
      return rowValue === value;
    },
    accessorFn: (row: ContractResponse) => row.dealStatus,
  },
  {
    id: "comments",
    header: "Комментарии",
    cell: (info: CellContext<ContractResponse, unknown>) => {
      const value = info.getValue() as ReactNode;
      return <span className="line-clamp-2">{value}</span>;
    },
    size: 300,
    minSize: 300,
    enableHiding: true,
    accessorFn: (row: ContractResponse) => row.comments,
  },
];
