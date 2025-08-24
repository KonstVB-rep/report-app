import { TaskStatus } from "@prisma/client";
// import { CheckedState } from "@radix-ui/react-checkbox";
import { CellContext, ColumnDef } from "@tanstack/react-table";

import { ReactNode } from "react";
import { DateRange } from "react-day-picker";

import { endOfDay, startOfDay } from "date-fns";
import { Ban, CheckCircle2Icon, LoaderIcon, StickyNote } from "lucide-react";

import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import { TaskWithUserInfo } from "@/entities/task/types";
import {
  LABEL_TASK_PRIORITY,
  LABEL_TASK_STATUS,
  TASK_PRIORITY_COLOR_BG,
} from "@/feature/task/model/constants";
// import { Checkbox } from "@/shared/components/ui/checkbox";
import { Badge } from "@/shared/components/ui/badge";
import { formatDateTime } from "@/shared/lib/helpers/formatDate";

export const columnsDataTask: ColumnDef<TaskWithUserInfo, unknown>[] = [
  {
    id: "rowNumber",
    header: "№",
    cell: ({ row }) => Number(row.index) + 1,
    enableHiding: false,
    enableSorting: false,
    accessorFn: () => "",
    minSize: 100,
    maxSize: 100,
  },
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value: CheckedState) =>
  //           table.toggleAllPageRowsSelected(!!value)
  //         }
  //         aria-label="Select all"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value: CheckedState) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: "startDate",
    header: "Дата начала",
    cell: (info: CellContext<TaskWithUserInfo, unknown>) => {
      const date = info.getValue() as string;
      return formatDateTime(date);
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
    accessorFn: (row: TaskWithUserInfo) => row.startDate,
  },
  {
    id: "title",
    header: "Задача",
    cell: (info: CellContext<TaskWithUserInfo, unknown>) => {
      const value = info.getValue() as ReactNode;
      return value;
    },
    accessorFn: (row: TaskWithUserInfo) => {
      return row.title;
    },
  },
  {
    id: "description",
    header: "Описание",
    cell: (info: CellContext<TaskWithUserInfo, unknown>) => {
      const value = info.getValue() as ReactNode;
      return value;
    },
    accessorFn: (row: TaskWithUserInfo) => row.description,
  },
  {
    id: "taskStatus",
    header: "Статус",
    cell: (info: CellContext<TaskWithUserInfo, unknown>) => {
      const value = info.getValue() as keyof typeof LABEL_TASK_STATUS;
      // return <span>{LABEL_TASK_STATUS[value]}</span>;
      const icon = {
        [TaskStatus.OPEN]: <StickyNote />,
        [TaskStatus.IN_PROGRESS]: <LoaderIcon />,
        // [TaskStatus.IN_REVIEW]:  <MessageCircleWarning />,
        [TaskStatus.DONE]: (
          <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
        ),
        [TaskStatus.CANCELED]: (
          <Ban className="text-red-500 dark:text-red-400" />
        ),
      };
      return (
        <Badge
          variant="outline"
          className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
        >
          {icon[value]}
          {LABEL_TASK_STATUS[value]}
        </Badge>
      );
    },
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
    accessorFn: (row: TaskWithUserInfo) => row.taskStatus,
  },
  {
    id: "taskPriority",
    header: "Приоритет",
    cell: (info: CellContext<TaskWithUserInfo, unknown>) => {
      const value = info.getValue() as keyof typeof LABEL_TASK_PRIORITY;
      // const bgColor =
      //   value === TaskPriority.LOW
      //     ? "bg-green-600"
      //     : value === TaskPriority.MEDIUM
      //       ? "bg-yellow-600"
      //       : value === TaskPriority.HIGH
      //         ? "bg-orange-600"
      //         : "bg-red-600";

      return (
        <span
          className={`abs-element absolute inset-4 flex items-center justify-center rounded-md ${TASK_PRIORITY_COLOR_BG[value]} `}
        >
          {LABEL_TASK_PRIORITY[value]}
        </span>
      );
    },
    accessorFn: (row: TaskWithUserInfo) => row.taskPriority,
  },
  {
    id: "assignerId",
    header: "Автор",
    cell: (info: CellContext<TaskWithUserInfo, unknown>) => {
      const userId = info.getValue() as string;
      const { deptsFormatted } = useStoreDepartment.getState();
      const users = deptsFormatted?.reduce((acc, curr) => {
        curr.users.forEach((user) => {
          acc = { ...acc, ...user };
        });
        return acc;
      }, {});

      if (!users) {
        return null;
      }

      const userName = (users[userId as keyof typeof users] as string)
        .split(" ")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");

      return userName;
    },
    accessorFn: (row: TaskWithUserInfo) => row.assignerId,
  },
  {
    id: "executorId",
    header: "Исполнитель",
    cell: (info: CellContext<TaskWithUserInfo, unknown>) => info.getValue(),
    filterFn: (row, columnId, filterValues) => {
      if (!filterValues || filterValues.length === 0) {
        return true;
      }

      const userIdOfProject = row.original.executorId;
      return filterValues.includes(userIdOfProject);
    },
    meta: {
      isMultiSelect: true,
    },
    accessorFn: (row: TaskWithUserInfo) => (
      <span className="capitalize">{row?.executor.username}</span>
    ),
  },
  {
    id: "dueDate",
    header: "Срок до",
    cell: (info: CellContext<TaskWithUserInfo, unknown>) => {
      const date = info.getValue() as string;
      return formatDateTime(date);
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
    accessorFn: (row: TaskWithUserInfo) => row.dueDate,
  },
];
