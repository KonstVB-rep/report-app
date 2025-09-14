import { CheckedState } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";

import { ListCheck } from "lucide-react";

import { EventInputType } from "@/feature/calendar/types";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";

export const columnsDataEvents: ColumnDef<EventInputType, unknown>[] = [
  {
    id: "rowNumber",
    header: "№",
    cell: ({ row }) => Number(row.index) + 1,
    enableHiding: false,
    enableSorting: false,
    accessorFn: () => "",
    minSize: 80,
    maxSize: 80,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Label
        className={cn("flex items-center justify-center cursor-pointer gap-1")}
      >
        {table.getIsSomePageRowsSelected() ||
        table.getIsAllPageRowsSelected() ? (
          <ListCheck />
        ) : (
          "Выбрать"
        )}
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
    accessorFn: (row: EventInputType) => row.id,
  },
  {
    id: "start",
    header: "Начало",
    cell: (info) => {
      const { row } = info;
      return row.original.start.toLocaleDateString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    size: 150,
    minSize: 150,
    maxSize: 150,
    enableHiding: false,
    accessorFn: () => "",
  },
  {
    id: "end",
    header: "Конец",
    cell: (info) => {
      const { row } = info;
      return row.original.end.toLocaleDateString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    size: 150,
    minSize: 150,
    maxSize: 150,
    enableHiding: false,
    accessorFn: () => "",
  },
  {
    id: "title",
    header: "Событие",
    accessorKey: "title",
    cell: (info) => <p className="break-all">{info.getValue() as string}</p>,
    enableHiding: false,
  },
];
