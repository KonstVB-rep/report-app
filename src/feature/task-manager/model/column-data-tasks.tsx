import { Task, TaskPriority } from "@prisma/client";
import { CellContext, ColumnDef } from "@tanstack/react-table";

import { DateRange } from "react-day-picker";

import { endOfDay, startOfDay } from "date-fns";

export const columnsDataTask: ColumnDef<Task, unknown>[] = [
  {
    id: "title",
    header: "Задача",
    cell: (info: CellContext<Task, unknown>) => info.getValue(),
    accessorFn: (row: Task) => row.title,
  },
  {
    id: "description",
    header: "Описание",
    cell: (info: CellContext<Task, unknown>) => info.getValue(),
    accessorFn: (row: Task) => row.description,
  },
  {
    id: "taskStatus",
    header: "Статус",
    cell: (info: CellContext<Task, unknown>) => info.getValue(),
    meta: {
      isMultiSelect: true,
    },
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      if (!rowValue) return false;
      if (Array.isArray(value)) {
        return value.includes(rowValue);
      }
      return rowValue === value;
    },
    accessorFn: (row: Task) => row.taskStatus,
  },
  {
    id: "taskPriority",
    header: "Приоритет",
    cell: (info: CellContext<Task, unknown>) => info.getValue(),
    accessorFn: (row: Task) => {
      const bgColor =
        row.taskPriority === TaskPriority.LOW
          ? "bg-green-600"
          : row.taskPriority === TaskPriority.MEDIUM
            ? "bg-yellow-600"
            : row.taskPriority === TaskPriority.HIGH
              ? "bg-orange-600"
              : "bg-red-600";
      return (
        <span
          className={`p-2 rounded-md flex items-center justify-center ${bgColor}`}
        >
          {row.taskPriority}
        </span>
      );
    },
  },
  {
    id: "assignerId",
    header: "Назначен",
    cell: (info: CellContext<Task, unknown>) => info.getValue(),
    accessorFn: (row: Task) => row.assignerId,
  },
  {
    id: "executorId",
    header: "Исполнитель",
    cell: (info: CellContext<Task, unknown>) => info.getValue(),
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      if (!rowValue) return false;
      if (Array.isArray(value)) {
        return value.includes(rowValue);
      }
      return rowValue === value;
    },
    meta: {
      isMultiSelect: true,
    },
    accessorFn: (row: Task) => row.executorId,
  },
  {
    id: "dueDate",
    header: "Срок",
    cell: (info: CellContext<Task, unknown>) => {
      const date = info.getValue() as Date;
      return date.toLocaleDateString("ru-RU");
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
    accessorFn: (row: Task) => row.dueDate,
  },
];
