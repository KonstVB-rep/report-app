"use client";

import { PermissionEnum } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";

import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import useDataTableFilters from "@/entities/deal/hooks/useDataTableFilters";
import { DealTypeLabels } from "@/entities/deal/lib/constants";
import AddNewDeal from "@/entities/deal/ui/Modals/AddNewDeal";
import FiltersManagment from "@/feature/tableFilters/ui/FiltersManagment";
import ICONS_TYPE_FILE from "@/widgets/Files/libs/iconsTypeFile";

import ProtectedByPermissions from "../Protect/ProtectedByPermissions";
import TableComponent from "./TableComponent";

const FiltersBlock = dynamic(() => import("../Filters/FiltersBlock"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-20 bg-muted rounded-md">
      <Loader className="animate-spin" />
    </div>
  ),
});

const includedColumns = [
  "nameObject",
  "nameDeal",
  "contact",
  "phone",
  "email",
  "comments",
];

interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowLink?: (row: TData & { id: string }, type: string) => string;
  type: keyof typeof DealTypeLabels;
  isExistActionDeal?: boolean;
}

const handleExport = async <
  TData extends Record<string, unknown>,
  TValue = unknown,
>(
  table: Table<TData>,
  columns: ColumnDef<TData, TValue>[]
) => {
  const { downloadToExcel } = await import("./exceljs/downLoadToExcel");
  downloadToExcel(table, columns);
};

const DataTable = <TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  getRowLink,
  type,
  isExistActionDeal = true,
}: DataTableProps<TData, TValue>) => {
  const searchParams = useSearchParams();
  const { dealType } = useParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;

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

  const {
    selectedColumns,
    setSelectedColumns,
    filterValueSearchByCol,
    setFilterValueSearchByCol,
    openFilters,
    setOpenFilters,
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
    <div className="relative grid w-full overflow-hidden rounded-lg border bg-background p-2">
      <div className="flex items-center justify-between gap-2 pb-2">
        {memoizedData.length > 0 && (
          <ProtectedByPermissions
            permissionArr={[PermissionEnum.DOWNLOAD_REPORTS]}
          >
            <Button
              variant={"ghost"}
              onClick={() => handleExport<TData, TValue>(table, columns)}
              className="w-fit border p-2 hover:bg-slate-700"
              title="Export to XLSX"
            >
              {ICONS_TYPE_FILE[".xls"]({ width: 20, height: 20 })}
            </Button>
          </ProtectedByPermissions>
        )}

        {memoizedData.length > 0 && (
          <div className="flex flex-1 items-center justify-between gap-2">
            <FiltersManagment
              setColumnFilters={setColumnFilters}
              setColumnVisibility={setColumnVisibility}
              setSelectedColumns={setSelectedColumns}
              openFilters={openFilters}
              setOpenFilters={setOpenFilters}
              columnFilters={columnFilters}
              columnVisibility={columnVisibility}
              selectedColumns={[]}
            />
          </div>
        )}

        <AddNewDeal type={dealType as string} />
      </div>
      <div
        className={`grid overflow-hidden transition-all duration-200 ${openFilters ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"}`}
      >
        {memoizedData.length > 0 && openFilters && (
          <FiltersBlock
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            onDateChange={handleDateChange}
            onClearDateFilter={handleClearDateFilter}
            value={value}
            columns={columns as ColumnDef<Record<string, unknown>, unknown>[]}
            includedColumns={includedColumns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            filterValueSearchByCol={filterValueSearchByCol}
            setFilterValueSearchByCol={setFilterValueSearchByCol}
            type={type}
            table={table as Table<Record<string, unknown>>}
          />
        )}
      </div>

      {data.length ? (
        <TableComponent
          table={table}
          getRowLink={getRowLink}
          isExistActionDeal={isExistActionDeal}
        />
      ) : (
        <h1 className="my-2 rounded-md bg-muted px-4 py-2 text-center text-xl">
          Проекты не найдены
        </h1>
      )}
    </div>
  );
};

export default DataTable;
