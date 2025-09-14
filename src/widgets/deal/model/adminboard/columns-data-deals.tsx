"use client";

import { CheckedState } from "@radix-ui/react-checkbox";
import { CellContext, ColumnDef } from "@tanstack/react-table";

import { ReactNode } from "react";
import { DateRange } from "react-day-picker";

import { endOfDay, startOfDay } from "date-fns";

import { DealBase } from "@/entities/deal/types";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

export const columnsDataDeals: ColumnDef<DealBase, unknown>[] = [
  {
    id: "rowNumber",
    header: "№",
    cell: ({ row }) => Number(row.index) + 1,
    enableHiding: false,
    enableSorting: false,
    accessorFn: () => "",
    maxSize: 100,
    enableResizing: false,
    meta: {
      isNotSearchable: true,
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Label
        className={cn(
          "flex items-center justify-center cursor-pointer gap-1",
          (table.getIsSomePageRowsSelected() ||
            table.getIsAllPageRowsSelected()) &&
            "text-blue-600"
        )}
      >
        Выбрать
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: CheckedState) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          className="opacity-0 w-0 h-0"
          aria-label="Select all"
        />
      </Label>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: CheckedState) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    minSize: 100,
    maxSize: 100,
  },
  {
    id: "id",
    header: "",
    cell: (info) => info.getValue(),
    enableHiding: true,
    meta: {
      hidden: true,
    },
    accessorFn: (row: DealBase) => row.id,
  },
  {
    id: "dateRequest",
    header: "Дата заявки",
    cell: (info: CellContext<DealBase, unknown>) => {
      const date = info.getValue() as Date;
      return date.toLocaleDateString("ru-RU");
    },
    enableHiding: true,
    meta: {
      isDateFilter: true,
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
    enableResizing: false,
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
    accessorFn: (row: DealBase) => row.dateRequest,
  },
  {
    id: "nameDeal",
    header: "Название сделки",
    cell: (info: CellContext<DealBase, unknown>) => {
      const value = info.getValue() as ReactNode;
      return value;
    },
    enableHiding: true,
    accessorFn: (row: DealBase) => row.nameDeal,
  },
  {
    id: "nameObject",
    header: "Название объекта",
    cell: (info: CellContext<DealBase, unknown>) => {
      const value = info.getValue() as ReactNode;
      return value;
    },
    enableHiding: true,
    accessorFn: (row: DealBase) => row.nameObject,
  },
  {
    id: "comments",
    header: "Комментарии",
    cell: (info: CellContext<DealBase, unknown>) => {
      const value = info.getValue() as ReactNode;
      return value;
    },
    minSize: 300,
    enableHiding: true,
    accessorFn: (row: DealBase) => row.comments,
  },
  {
    id: "user",
    header: "Менеджер",
    cell: (info) => info.getValue(),
    enableHiding: true,
    // meta: {
    //   hidden: true,
    // },
    filterFn: (row, columnId, filterValues) => {
      if (!filterValues || filterValues.length === 0) {
        return true;
      }

      const userIdOfProject = row.original.userId;
      return filterValues.includes(userIdOfProject);
    },
    accessorFn: (row: DealBase) => row.userId,
  },
];
