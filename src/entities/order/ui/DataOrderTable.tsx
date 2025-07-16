"use client";

import { PermissionEnum } from "@prisma/client";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";

import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import useDataTableFilters from "@/entities/deal/hooks/useDataTableFilters";
import AddNewDeal from "@/entities/deal/ui/Modals/AddNewDeal";
import { DataTableFiltersProvider } from "@/feature/tableFilters/context/DataTableFiltersProvider";
import { DataTableFiltersContextType } from "@/feature/tableFilters/context/useDataTableFiltersContext";
import FiltersManagement from "@/feature/tableFilters/ui/FiltersManagement";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";
import ICONS_TYPE_FILE from "@/widgets/Files/libs/iconsTypeFile";

import { STATUS_ORDER } from "../lib/constants";
import LoadFilterItem from "./LoadFilterItem";
import OrdersTableBody from "./OrdersTableBody";

const FilterByUsers = dynamic(
  () => import("@/shared/ui/Filters/FilterByUsers"),
  {
    ssr: false,
    loading: () => <LoadFilterItem />,
  }
);

const DateRangeFilter = dynamic(() => import("@/shared/ui/DateRangeFilter"), {
  ssr: false,
  loading: () => <LoadFilterItem />,
});
const MultiColumnFilter = dynamic(
  () => import("@/shared/ui/MultiColumnFilter"),
  {
    ssr: false,
    loading: () => <LoadFilterItem />,
  }
);
const FilterPopoverRadio = dynamic(
  () => import("@/shared/ui/Filters/FilterPopoverRadio"),
  {
    ssr: false,
    loading: () => <LoadFilterItem />,
  }
);

interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isExistActionDeal?: boolean;
}

const handleExport = async <
  TData extends Record<string, unknown>,
  TValue = unknown,
>(
  table: Table<TData>,
  columns: ColumnDef<TData, TValue>[]
) => {
  const { downloadToExcel } = await import(
    "@/shared/ui/Table/exceljs/downLoadToExcel"
  );
  downloadToExcel(table, columns);
};

const DataOrderTable = <TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  isExistActionDeal = true,
}: DataTableProps<TData, TValue>) => {
  const { dealType } = useParams();

  const [sorting, setSorting] = useState<SortingState>([]);

  const memoizedData = useMemo(() => data ?? [], [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const {
    selectedColumns,
    setSelectedColumns,
    filterValueSearchByCol,
    setFilterValueSearchByCol,
    openFilters,
    setOpenFilters,
    handleDateChange,
    handleClearDateFilter,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    includedColumns,
  } = useDataTableFilters();

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

  const filtersContextValue: DataTableFiltersContextType<TData, TValue> = {
    selectedColumns,
    setSelectedColumns,
    filterValueSearchByCol,
    setFilterValueSearchByCol,
    openFilters,
    setOpenFilters,
    handleDateChange,
    handleClearDateFilter,
    columnFilters,
    columnVisibility,
    setColumnFilters,
    setColumnVisibility,
    includedColumns,
    columns,
  };

  return (
    <DataTableFiltersProvider<TData, TValue> value={filtersContextValue}>
      <div className="relative grid w-full overflow-auto rounded-lg border bg-background p-2 auto-rows-max">
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
              <FiltersManagement openFilters={openFilters} />
            </div>
          )}

          <AddNewDeal type={dealType as string} />
        </div>
        <div
          className={`grid overflow-hidden transition-all duration-200 ${openFilters ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"}`}
        >
          {memoizedData.length > 0 && openFilters && (
            <>
              <div className="py-2 flex flex-wrap justify-start gap-2">
                <FilterByUsers label="Менеджер" />

                <div className="flex gap-2 justify-start flex-wrap">
                  <DateRangeFilter
                    onDateChange={handleDateChange("dateRequest")}
                    onClearDateFilter={handleClearDateFilter}
                    value={value}
                  />

                  <MultiColumnFilter />

                  <FilterPopoverRadio
                    key="orderStatus"
                    columnId="orderStatus"
                    options={STATUS_ORDER}
                    label="Статус"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {data?.length ? (
          <OrdersTableBody
            table={table}
            isExistActionDeal={isExistActionDeal}
          />
        ) : (
          <h1 className="my-2 rounded-md bg-muted px-4 py-2 text-center text-xl">
            Заявок нет
          </h1>
        )}
      </div>
    </DataTableFiltersProvider>
  );
};

export default DataOrderTable;
