import { CellContext, ColumnDef } from "@tanstack/react-table";

import { EventInputType } from "@/feature/calendar/types";

export const columnsDataCalendar: ColumnDef<EventInputType, unknown>[] = [
  {
    id: "start",
    header: "Дата",
    cell: (info: CellContext<EventInputType, unknown>) => {
      const { row } = info;
      if (
        row.original.start.toLocaleDateString("ru-RU") ===
        row.original.end.toLocaleDateString("ru-RU")
      ) {
        return row.original.start.toLocaleDateString("ru-RU");
      }
      return `${row.original.start.toLocaleDateString("ru-RU")} - ${row.original.end.toLocaleDateString("ru-RU")}`;
    },
    enableHiding: false,
    enableSorting: false,
    accessorFn: (row: EventInputType) => row.start,
  },
  {
    id: "eventTime",
    header: "Время",
    cell: (info: CellContext<EventInputType, unknown>) => {
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
    cell: (info: CellContext<EventInputType, unknown>) => info.getValue(),
    enableHiding: false,
    enableSorting: false,
    accessorFn: (row: EventInputType) => (
      <p className="break-all">{row.title}</p>
    ),
  },
];
