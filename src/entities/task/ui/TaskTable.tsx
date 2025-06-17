// import { TaskStatus } from "@prisma/client";
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

import { useParams, useSearchParams } from "next/navigation";

import { TableCell, TableRow } from "@/components/ui/table";
import ContextRowTable from "@/shared/ui/ContextRowTable/ContextRowTable";
import DateRangeFilter from "@/shared/ui/DateRangeFilter";
import FilterByUsers from "@/shared/ui/Filters/FilterByUsers";
import FilterPopoverGroup from "@/shared/ui/Filters/FilterPopoverGroup";
import TableTemplate from "@/shared/ui/Table/TableTemplate";

import useDataTableFilters from "@/entities/deal/hooks/useDataTableFilters";
import { columnsDataTask } from "../model/column-data-tasks";
import { LABEL_TASK_STATUS } from "../model/constants";
import EditTaskDialogContextMenu from "./Modals/EditTaskDialogContextMenu";
import DelTaskDialogContextMenu from "./Modals/DelTaskDialogContextMenu";

interface TaskTableProps<TData> {
  data: TData[];
}

const includedColumns: string[] | [] = []

const TaskTable = <TData extends Record<string, unknown>>({
  data
}: TaskTableProps<TData>) => {
  const searchParams = useSearchParams();
  const { departmentId } = useParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columnsDataTask, []) as ColumnDef<
    TData,
    unknown
  >[];

  //  ${row.original.taskStatus === TaskStatus.IN_PROGRESS && "bg-blue-900/40"} ${row.original.taskStatus === TaskStatus.CANCELED && "bg-red-900/40"} ${row.original.taskStatus === TaskStatus.DONE && "bg-lime-200/20"

  const renderRowCells = useCallback((row: Row<TData>) => {
    return row.getVisibleCells().map((cell) => (
      <TableCell
        key={cell.id}
        className="td min-w-12 border-b border-r h-[57px] !p-2"
        // style={{ width: cell.column.getSize() }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ));
  }, []);

  const renderRow = useCallback(
    (row: Row<TData>): ReactNode => {
      return (
        <ContextRowTable
          key={row.id}
          modals={(setOpenModal) => ({
            edit: (
              <EditTaskDialogContextMenu
                close={() => setOpenModal(null)}
                id={row.original.id as string}
              />
            ),
            delete: (
              <DelTaskDialogContextMenu
                close={() => setOpenModal(null)}
                id={row.original.id as string}
              />
            ),
          })}
          path={`/tasks/${departmentId}/${row.original.assignerId}/${row.original.id}`}
        >
          <TableRow
            key={row.id}
            className={`tr hover:bg-zinc-600 hover:text-white`}
          >
            {renderRowCells(row)}
          </TableRow>
        </ContextRowTable>
      );
    },
    [departmentId, renderRowCells]
  );

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
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
      rowSelection,
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

  // const handleDateChange = useCallback(
  //   (date: DateRange | undefined) => {
  //     setColumnFilters((prev) => {
  //       const newFilters = prev.filter((f) => f.id !== "dueDate");
  //       return date?.from && date?.to
  //         ? ([
  //             ...newFilters,
  //             { id: "dueDate", value: { from: date.from, to: date.to } },
  //           ] as ColumnFiltersState)
  //         : newFilters;
  //     });
  //   },
  //   [setColumnFilters]
  // );

  // const handleClearDateFilter = useCallback(
  //   (columnId: string) => {
  //     setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
  //   },
  //   [setColumnFilters]
  // );

   const {
    // selectedColumns,
    // setSelectedColumns,
    // filterValueSearchByCol,
    // setFilterValueSearchByCol,
    // openFilters,
    // setOpenFilters,
    handleDateChange,
    handleClearDateFilter,
  } = useDataTableFilters({
    searchParams,
    includedColumns,
    setColumnFilters,
    setColumnVisibility,
    columnFilters,
    columnVisibility,
  });



  return (
    <div className="relative grid w-full overflow-hidden rounded-md border bg-background">
      <div className="flex items-center flex-wrap gap-2 p-2 border-b mb-2">
        <div className="flex items-center">
          <FilterByUsers
            columnFilters={table.getState().columnFilters}
            setColumnFilters={setColumnFilters}
            label="Исполнитель"
            columnId="executorId"
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
          onDateChange={handleDateChange("dueDate")}
          onClearDateFilter={handleClearDateFilter}
          value={value}
        />
      </div>
      <div className="rounded-ee-md overflow-hidden border">
        <TableTemplate table={table} renderRow={renderRow} className="rounded-ee-md"/>
      </div>
    </div>
  );
};

export default TaskTable;
