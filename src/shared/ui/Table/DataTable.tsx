"use client";

import { PermissionEnum } from "@prisma/client";
import { 
  // RankingInfo,
   rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnDef,
  FilterFn,
  // getCoreRowModel,
  // getExpandedRowModel,
  // getFilteredRowModel,
  // getSortedRowModel,
  // Row,
  // SortingState,
  Table,
  // useReactTable,
} from "@tanstack/react-table";

// import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
// import useDataTableFilters from "@/entities/deal/hooks/useDataTableFilters";
import { DealTypeLabels } from "@/entities/deal/lib/constants";
import AddNewDeal from "@/entities/deal/ui/Modals/AddNewDeal";
import { DataTableFiltersProvider } from "@/feature/tableFilters/context/DataTableFiltersProvider";
// import { DataTableFiltersContextType } from "@/feature/tableFilters/context/useDataTableFiltersContext";
import FiltersManagement from "@/feature/tableFilters/ui/FiltersManagement";
import ICONS_TYPE_FILE from "@/widgets/Files/libs/iconsTypeFile";

import DebouncedInput from "../DebouncedInput";
import ProtectedByPermissions from "../Protect/ProtectedByPermissions";
import TableComponent from "./TableComponent";
import { DealBase } from "./model/types";
import { useTableState } from "@/shared/hooks/useTableState";
 
const FiltersBlock = dynamic(() => import("../Filters/FiltersBlock"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-20 bg-muted rounded-md">
      <Loader className="animate-spin" />
    </div>
  ),
});



const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// declare module '@tanstack/react-table' {
//   //add fuzzy filter to the filterFns
//   interface FilterFns {
//     fuzzy: FilterFn<unknown>
//   }
//   interface FilterMeta {
//     itemRank: RankingInfo
//   }
// }

const handleExport = async <
  TData,
>(
  table: Table<TData>,
  columns: ColumnDef<TData>[],
  tableType?: string
) => {
  const { downloadToExcel } = await import("./exceljs/downLoadToExcel");
  downloadToExcel(table, columns, { tableType });
};

interface DataTableProps<T extends DealBase> {
  columns: ColumnDef<T>[];
  data: T[];
  getRowLink?: (row: T, type: string) => string;
  type: keyof typeof DealTypeLabels;
  hasEditDeleteActions?: boolean;
}

// Обратите внимание на запятую после T - это синтаксис TypeScript для generic-компонентов
const DataTable = <T extends DealBase>({
  columns,
  data,
  getRowLink,
  type,
  hasEditDeleteActions = true,
}: DataTableProps<T>) => {
  const { dealType } = useParams();

  // const [sorting, setSorting] = useState<SortingState>([]);

  // const memoizedData = useMemo(() => data, [data]);
  // const memoizedColumns = useMemo(() => columns, [columns]);

  // const {
  //   selectedColumns,
  //   setSelectedColumns,
  //   filterValueSearchByCol,
  //   setFilterValueSearchByCol,
  //   openFilters,
  //   setOpenFilters,
  //   handleDateChange,
  //   handleClearDateFilter,
  //   columnFilters,
  //   setColumnFilters,
  //   columnVisibility,
  //   setColumnVisibility,
  //   includedColumns,
  //   globalFilter,
  //   setGlobalFilter,
  // } = useDataTableFilters();

  const {table,filtersContextValue, openFilters,setGlobalFilter} = useTableState(data, columns)


// Конкретные значения:
const {
  columnFilters,    // Активные фильтры колонок
  globalFilter,     // Значение глобального фильтра
} = table.getState();

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;

     // Получаем текущие данные (с учётом всех применённых фильтров/сортировок)
  const currentData = table.getRowModel().rows.map(row => row.original);

  // Получаем исходные данные (без фильтров/сортировок)
  const originalData = table.getCoreRowModel().rows.map(row => row.original);

  // const table = useReactTable({
  //   data: memoizedData,
  //   columns: memoizedColumns,
  //   filterFns: {
  //     fuzzy: fuzzyFilter,
  //   },
  //   onColumnFiltersChange: setColumnFilters,
  //   onColumnVisibilityChange: setColumnVisibility,
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   onSortingChange: setSorting,
  //   getCoreRowModel: getCoreRowModel(),
  //   enableColumnResizing: true,
  //   columnResizeMode: "onChange",
  //   onGlobalFilterChange: setGlobalFilter,
  //   globalFilterFn: "includesString",
  //   debugTable: true,
  //   debugHeaders: true,
  //   debugColumns: true,
  //   state: {
  //     sorting,
  //     columnFilters,
  //     globalFilter,
  //     columnVisibility: {
  //       ...columnVisibility,
  //       user: false,
  //       // resource: false // Скрываем колонку с id 'user'
  //     },
  //   },
  //   meta: {
  //     columnVisibility: {
  //       resource: false,
  //       // user: false,
  //     },
  //   },
  // });

  // const filtersContextValue: DataTableFiltersContextType<T> = {
  //   selectedColumns,
  //   setSelectedColumns,
  //   filterValueSearchByCol,
  //   setFilterValueSearchByCol,
  //   openFilters,
  //   setOpenFilters,
  //   handleDateChange,
  //   handleClearDateFilter,
  //   columnFilters,
  //   columnVisibility,
  //   setColumnFilters,
  //   setColumnVisibility,
  //   includedColumns,
  //   columns: memoizedColumns,
  // };

  return (
    <DataTableFiltersProvider value={filtersContextValue}>
      <div className="relative grid w-full overflow-auto rounded-lg border bg-background p-2 auto-rows-max">
        <div className="flex items-center justify-between gap-2 pb-2">
          {currentData.length > 0 && (
            <ProtectedByPermissions
              permissionArr={[PermissionEnum.DOWNLOAD_REPORTS]}
            >
              <Button
                variant={"ghost"}
                onClick={() =>
                  handleExport<T>(table, columns, type)
                }
                className="w-fit border p-2 hover:bg-slate-700"
                title="Export to XLSX"
              >
                {ICONS_TYPE_FILE[".xls"]({ width: 20, height: 20 })}
              </Button>
            </ProtectedByPermissions>
          )}

          <div>
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 font-lg shadow border border-block"
              placeholder="Search all columns..."
            />
          </div>

          {originalData.length > 0 && (
            <div className="flex flex-1 items-center justify-between gap-2">
              <FiltersManagement openFilters={openFilters} />
            </div>
          )}

          <AddNewDeal type={dealType as string} />
        </div>
        <div
          className={`grid overflow-hidden transition-all duration-200 ${openFilters ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"}`}
        >
          {originalData.length > 0 && openFilters && (
            <FiltersBlock
              value={value}
              type={type}
              table={table as Table<Record<string, unknown>>}
            />
          )}
        </div>

        {data.length ? (
          <TableComponent
            table={table}
            getRowLink={getRowLink}
            hasEditDeleteActions={hasEditDeleteActions}
          />
        ) : (
          <h1 className="my-2 rounded-md bg-muted px-4 py-2 text-center text-xl">
            Нет данных
          </h1>
        )}
      </div>
    </DataTableFiltersProvider>
  );
};

export default DataTable;
