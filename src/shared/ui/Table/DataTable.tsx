"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState, ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  ColumnDef,
  Row,
} from "@tanstack/react-table";
import { MoveUp, MoveDown, ArrowDownUp } from "lucide-react";
import ContextRowTable from "../ContextRowTable/ContextRowTable";
import SelectColumns from "../SelectColumns";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "../DateRangeFilter";
import FilterPopover from "../FilterPopover";
import {
  DeliveryLabels,
  DirectionLabels,
  StatusLabels,
} from "@/entities/project/lib/constants";
import MultiColumnFilter from "../MultiColumnFilter";
import Link from "next/link";

interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowLink?: (row: TData & { id: string }) => string;
}

const DataTable = <TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  getRowLink,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
    setColumnFilters((prev) => {
      if (!date?.from && !date?.to) {
        return prev.filter((f) => f.id !== "dateRequest");
      }
      return prev.some((f) => f.id === "dateRequest")
        ? prev.map((f) =>
            f.id === "dateRequest" ? { ...f, value: date || {} } : f
          )
        : [...prev, { id: "dateRequest", value: date || {} }];
    });
  };

  const handleClearDateFilter = (columnId: string) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
  };

  const renderRowCells = (row: Row<TData>) => {
    const rowLink = getRowLink
      ? getRowLink(row.original as TData & { id: string })
      : undefined;
    return row.getVisibleCells().map((cell) => (
      <TableCell key={cell.id} className="td border-r border-b min-w-12">
        {rowLink ? (
          <Link href={rowLink}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Link>
        ) : (
          flexRender(cell.column.columnDef.cell, cell.getContext())
        )}
      </TableCell>
    ));
  };

  const renderRow = (row: Row<TData>): ReactNode => {
    return (
      <ContextRowTable key={row.id} rowData={row.original}>
        <TableRow className="cursor-pointer hover:bg-zinc-600 hover:text-white tr">
          {renderRowCells(row)}
        </TableRow>
      </ContextRowTable>
    );
  };

  return (
    <div className="flex flex-col bg-background w-full max-h-[80vh] overflow-auto border rounded-lg p-2">
      <div className="flex gap-2 justify-between">
        <DateRangeFilter
          onDateChange={handleDateChange}
          onClearDateFilter={handleClearDateFilter}
          value={
            columnFilters.find((f) => f.id === "dateRequest")?.value as
              | DateRange
              | undefined
          }
        />
        <MultiColumnFilter
          table={table}
          columns={columns}
          excludedColumns={[
            "rowNumber",
            "direction",
            "deliveryType",
            "dateRequest",
            "user",
            "lastDateConnection",
            "plannedDateConnection",
            "projectStatus",
            "delta",
            "amounCo",
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center justify-start gap-2 py-2 bg-background">
        <FilterPopover
          columnId="projectStatus"
          options={StatusLabels}
          label="Статус"
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <FilterPopover
          columnId="direction"
          options={DirectionLabels}
          label="Направление"
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <FilterPopover
          columnId="deliveryType"
          options={DeliveryLabels}
          label="Тип поставки"
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <SelectColumns data={table} />
      </div>
      {data && data.length ? (
        <Table className="w-full border rounded-lg mb-2 border-separate border-spacing-0">
          <TableHeader className="sticky top-0 z-1">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border-r border-zinc-600 bg-zinc-400 dark:bg-zinc-800 py-2 px-3"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center text-center justify-center w-full gap-1 h-full text-primary"
                            : "flex items-center justify-center h-full w-full text-center text-primary",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        <span className="first-letter:capitalize font-semibold text-xs text-start">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span>
                            {header.column.getIsSorted() === "asc" ? (
                              <MoveUp className="ml-2 h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <MoveDown className="ml-2 h-4 w-4" />
                            ) : (
                              <ArrowDownUp className="ml-2 h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="space-y-[2px] table-grid-container">
            {table.getRowModel().rows.map(renderRow)}
          </TableBody>
        </Table>
      ) : (
        <h1 className="text-center text-xl py-2 px-4 bg-muted rounded-md">
          Проекты не найдены
        </h1>
      )}
    </div>
  );
};

export default DataTable;
