"use client";

import { ColumnDef, Table } from "@tanstack/react-table";

import dynamic from "next/dynamic";

import { DataTableFiltersProvider } from "@/shared/custom-components/ui/Table/tableFilters/context/DataTableFiltersProvider";
import FiltersManagement from "@/shared/custom-components/ui/Table/tableFilters/ui/FiltersManagement";
import { useTableState } from "@/shared/hooks/useTableState";

import ButtonExportTableXls from "../Buttons/ButtonExportTableXls";
import DebouncedInput from "../DebouncedInput";
import LoaderCircle from "../Loader";
import { DealBase } from "./model/types";
import TableComponent from "./TableComponent";

const FiltersBlock = dynamic(() => import("../Filters/FiltersBlock"), {
  ssr: false,
  loading: () => <LoaderCircle />,
});

interface DataTableProps<T extends DealBase> {
  columns: ColumnDef<T>[];
  data: T[];
  hasEditDeleteActions?: boolean;
  children?: React.ReactNode;
}

const DataTable = <T extends DealBase>({
  columns,
  data,
  hasEditDeleteActions = true,
  children,
}: DataTableProps<T>) => {
  const { table, filtersContextValue, openFilters, setGlobalFilter } =
    useTableState(data, columns);

  const { globalFilter } = table.getState();

  const currentData = table.getRowModel().rows.map((row) => row.original); // Получаем текущие данные (с учётом всех применённых фильтров/сортировок)

  const originalData = table.getCoreRowModel().rows.map((row) => row.original); // Получаем исходные данные (без фильтров/сортировок)

  return (
    <DataTableFiltersProvider value={filtersContextValue}>
      <div className="relative grid w-full overflow-auto rounded-lg border bg-background p-2 auto-rows-max">
        <div className="flex items-center justify-between gap-2 pb-2">
          <ButtonExportTableXls
            isShow={currentData.length > 0}
            table={table}
            columns={columns}
          />

          <div>
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="p-2 font-lg shadow border border-block"
              placeholder="Search all columns..."
            />
          </div>

          <FiltersManagement
            openFilters={openFilters}
            isShow={originalData.length > 0}
          />

          {children}
        </div>
        <div
          className={`grid overflow-hidden transition-all duration-200 ${openFilters ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"}`}
        >
          <FiltersBlock
            table={table as Table<Record<string, unknown>>}
            isShow={originalData.length > 0 && openFilters}
          />
        </div>

        {data.length ? (
          <TableComponent
            table={table}
            hasEditDeleteActions={hasEditDeleteActions}
            openFilters={openFilters}
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
