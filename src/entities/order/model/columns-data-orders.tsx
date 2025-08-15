"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";

import { DateRange } from "react-day-picker";

import { endOfDay, startOfDay } from "date-fns";

import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import { OrderType, STATUS_ORDER } from "@/entities/order/lib/constants";
import { OrderResponse, StatusKey } from "@/entities/order/types";
import useStoreUser from "@/entities/user/store/useStoreUser";

export const columnsOrder: ColumnDef<OrderResponse, unknown>[] = [
  {
    id: "rowNumber",
    header: "№",
    accessorKey: "rowNumber",
    cell: ({ row }) => row.index + 1,
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: "dateRequest",
    accessorKey: "dateRequest",
    header: "Дата заявки",
    cell: (info: CellContext<OrderResponse, unknown>) => {
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
  },
  {
    id: "nameDeal",
    accessorKey: "nameDeal",
    header: "Название сделки",
    cell: (info: CellContext<OrderResponse, unknown>) => info.getValue(),
    enableHiding: true,
  },
  {
    id: "contact",
    accessorKey: "contact",
    header: "Контактное лицо",
    size: 300,
    minSize: 300,
    cell: (info: CellContext<OrderResponse, unknown>) => info.getValue(),
    enableHiding: true,
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Телефон",
    cell: (info: CellContext<OrderResponse, unknown>) => {
      return (
        <span className="whitespace-nowrap">{info.getValue() as string}</span> //тег
      );
    },
    enableHiding: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: (info: CellContext<OrderResponse, unknown>) => (
      <span className="whitespace-nowrap">{info.getValue() as string}</span>
    ),
    enableHiding: true,
  },

  {
    id: "comments",
    accessorKey: "comments",
    header: "Комментарии",
    size: 300,
    minSize: 300,
    cell: (info: CellContext<OrderResponse, unknown>) => info.getValue(), //тег
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "orderStatus",
    accessorKey: "orderStatus",
    header: "Статус",
    size: 150,
    minSize: 150,
    cell: (info: CellContext<OrderResponse, unknown>) => {
      const status = info.getValue() as string;
      return STATUS_ORDER[status as StatusKey];
    }, //тег
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "manager",
    accessorKey: "manager",
    header: "Менеджер",
    size: 240,
    minSize: 240,
    cell: (info) => {
      const authUser = useStoreUser.getState().authUser;
      const deps = useStoreDepartment.getState().deptsFormatted; // ✅ так можно

      const users = deps?.find((d) => d.id === authUser?.departmentId)?.users;

      const userId = info.getValue() as string;

      const userObj = users?.find((u) => u.hasOwnProperty(userId));

      const userName = userObj ? userObj[userId] : userId;

      return <span className="capitalize">{userName}</span>;
    },
    enableHiding: true, // Разрешает скрывать колонку
    // meta: {
    //   hidden: true, // Изначально скрыта
    // },
    filterFn: (row, columnId, filterValues) => {
      if (!filterValues || filterValues.length === 0) {
        return true;
      }

      const userIdOfProject = row.original.userId;
      return filterValues.includes(userIdOfProject);
    },
  },
  {
    id: "dealType",
    accessorKey: "dealType",
    header: "Тип сделки",
    cell: (info: CellContext<OrderResponse, unknown>) => {
      const dealType = info.getValue() as keyof typeof OrderType;
      return OrderType[dealType];
    },
    enableHiding: true,
  },
  {
    id: "resource",
    accessorKey: "resource",
    header: "Источник/Сайт",
    cell: (info: CellContext<OrderResponse, unknown>) => info.getValue(),
    enableHiding: true,
    // meta: {
    //   hidden: true,
    // },
  },
];
