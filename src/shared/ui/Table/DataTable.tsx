"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  ColumnDef,
} from "@tanstack/react-table";
import SelectColumns from "../SelectColumns";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "../DateRangeFilter";
import {
  DealTypeLabels,
  LABELS
} from "@/entities/deal/lib/constants";
import MultiColumnFilter from "../MultiColumnFilter";
import TableComponent from "./TableComponent";
import FilterPopoverGroup from "../Filters/FilterPopoverGroup";
import FilterPopover from "../Filters/FilterPopover";
import RenderFilterPopover from "../Filters/RenderFilterPopover";


interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowLink?: (row: TData & { id: string }, type: string) => string;
  type: keyof typeof DealTypeLabels;

}

const DataTable = <TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  getRowLink,
  type
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

  return (
    <div className="flex flex-col bg-background w-full max-h-[80vh] overflow-auto border rounded-lg p-2">
      <div className="pb-2">
        <RenderFilterPopover
          renderFilter={(usersDepartment) => (
            <FilterPopover
              columnId="user"
              options={usersDepartment}
              label="Менеджер"
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
            />
          )}
        />
      </div>
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
            "plannedDateConnection",
            "projectStatus",
            "delta",
            "amountCP",
            "amountPurchase",
            "amountWork",
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center justify-start gap-2 bg-background">
        <FilterPopoverGroup
          options={[
            {
              label: "Статус",
              columnId: "projectStatus",
              options: LABELS[type].STATUS,
            },
            {
              label: "Направление",
              columnId: "direction",
              options: LABELS[type].DIRECTION,
            },
            {
              label: "Тип поставки",
              columnId: "deliveryType",
              options: LABELS[type].DELIVERY,
            },
          ]}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <SelectColumns data={table} />
      </div>
      <TableComponent data={data} getRowLink={getRowLink} table={table} />
    </div>
  );
};

export default DataTable;
