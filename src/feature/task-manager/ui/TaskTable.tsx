import { TaskStatus } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { ReactNode, useCallback, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import { TableCell, TableRow } from "@/components/ui/table";
import DateRangeFilter from "@/shared/ui/DateRangeFilter";
import FilterByUsers from "@/shared/ui/Filters/FilterByUsers";
import FilterPopoverGroup from "@/shared/ui/Filters/FilterPopoverGroup";
import TableTemplate from "@/shared/ui/Table/TableTemplate";

import { columnsDataTask } from "../model/column-data-tasks";
import { LABEL_TASK_STATUS } from "../types";

interface TaskTableProps<TData> {
  data: TData[];
}

const TaskTable = <TData extends Record<string, unknown>>({
  data,
}: TaskTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columnsDataTask, []) as ColumnDef<
    TData,
    unknown
  >[];

  const renderRowCells = useCallback((row: Row<TData>) => {
    return row.getVisibleCells().map((cell) => (
      <TableCell
        key={cell.id}
        className="td min-w-12 border-b border-r"
        style={{ width: cell.column.getSize() }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ));
  }, []);

  const renderRow = useCallback(
    (row: Row<TData>): ReactNode => {
      return (
        <TableRow
          key={row.id}
          className={`tr hover:bg-zinc-600 hover:text-white  ${row.original.taskStatus === TaskStatus.IN_PROGRESS && "bg-blue-900/40"} ${row.original.taskStatus === TaskStatus.CANCELED && "bg-red-900/40"} ${row.original.taskStatus === TaskStatus.DONE && "bg-lime-200/20"}`}
          data-task-status={`${["IN_PROGRESS", "DONE", "CANCELED"].includes(row.original.taskStatus as string)}`}
        >
          {renderRowCells(row)}
        </TableRow>
      );
    },
    [renderRowCells]
  );

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility: {
        ...columnVisibility,
        user: false,
        // resource: false // Скрываем колонку с id 'user'
      },
    },
    meta: {
      columnVisibility: {
        resource: false,
        // user: false,
      },
    },
  });

  const value = columnFilters.find((f) => f.id === "dueDate")?.value as
    | DateRange
    | undefined;

  const handleDateChange = useCallback(
    (date: DateRange | undefined) => {
      setColumnFilters((prev) => {
        const newFilters = prev.filter((f) => f.id !== "dueDate");
        return date?.from && date?.to
          ? ([
              ...newFilters,
              { id: "dueDate", value: { from: date.from, to: date.to } },
            ] as ColumnFiltersState)
          : newFilters;
      });
    },
    [setColumnFilters]
  );

  const handleClearDateFilter = useCallback(
    (columnId: string) => {
      setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
    },
    [setColumnFilters]
  );

  return (
    <div>
      <div className="flex items-center gap-2 p-2 border-b border-t mb-2">
        <div className="flex items-center">
          <FilterByUsers
            columnFilters={table.getState().columnFilters}
            setColumnFilters={setColumnFilters}
            label="Исполнитель"
          />
        </div>
        <FilterPopoverGroup
          options={[
            {
              label: "Статус",
              columnId: "taskStatus",
              options: LABEL_TASK_STATUS,
            },
          ]}
          columnFilters={table.getState().columnFilters}
          setColumnFilters={setColumnFilters}
        />
          <DateRangeFilter
            onDateChange={handleDateChange}
            onClearDateFilter={handleClearDateFilter}
            value={value}
          />
      </div>
      <TableTemplate table={table} renderRow={renderRow} />
    </div>
  );
};

export default TaskTable;
