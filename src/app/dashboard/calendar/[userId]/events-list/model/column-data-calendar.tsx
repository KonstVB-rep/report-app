import { ColumnDef } from "@tanstack/react-table";

import { EventInputType } from "@/feature/calendar/types";

export const columnsDataCalendar: ColumnDef<EventInputType, unknown>[] = [
  {
    id: "start",
    header: "Дата",
    accessorKey: "start",
    cell: (info) => {
    const { row } = info;
    const startDate = row.original.start instanceof Date ? row.original.start : new Date(row.original.start);
    const endDate = row.original.end instanceof Date ? row.original.end : new Date(row.original.end);

    if (startDate.toLocaleDateString("ru-RU") === endDate.toLocaleDateString("ru-RU")) {
      return startDate.toLocaleDateString("ru-RU");
    }
    return `${startDate.toLocaleDateString("ru-RU")} - ${endDate.toLocaleDateString("ru-RU")}`;
  },
    enableHiding: false,
    enableSorting: false,
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    id: "eventTime",
    header: "Время",
    cell: (info) => {
      const { row } = info;
      return `${row.original.start.toLocaleTimeString("ru-RU", { timeStyle: "short" })} - ${row.original.end.toLocaleTimeString("ru-RU", { timeStyle: "short" })}`;
    },
    size: 100,
    minSize: 100,
    maxSize: 100,
    enableHiding: false,
    enableSorting: false,
    accessorFn: () => "",
  },
  {
    id: "title",
    header: "Событие",
    accessorKey: "title",
    cell: (info) => (
      <p className="break-all">{info.getValue() as string}</p>
    ),
    enableHiding: false,
    enableSorting: false,
  },
];
