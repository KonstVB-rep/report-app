"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DateRange } from "react-day-picker";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import AddNewDeal from "@/entities/deal/ui/Modals/AddNewDeal";
import { DataTableFiltersProvider } from "@/feature/tableFilters/context/DataTableFiltersProvider";
import { useDataTableFiltersContext } from "@/feature/tableFilters/context/useDataTableFiltersContext";
import FiltersManagement from "@/feature/tableFilters/ui/FiltersManagement";
import { useTableState } from "@/shared/hooks/useTableState";
;
import { DealBase } from "@/shared/ui/Table/model/types";


import { STATUS_ORDER } from "../lib/constants";
import LoadFilterItem from "./LoadFilterItem";
import OrdersTableBody from "./OrdersTableBody";
import { DealTypeLabels } from "./OrdersTemplateTable";
import ButtonExportTableXls from "@/shared/ui/Buttons/ButtonExportTableXls";

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

const FilterPopoverRadio = dynamic(
  () => import("@/shared/ui/Filters/FilterPopoverRadio"),
  {
    ssr: false,
    loading: () => <LoadFilterItem />,
  }
);

interface DataTableProps<T extends DealBase> {
  columns: ColumnDef<T>[];
  data: T[];
  hasEditDeleteActions?: boolean;
  type: keyof typeof DealTypeLabels;
}


const DataOrderTable = <T extends DealBase>({
  columns,
  data,
  hasEditDeleteActions = true,
}: DataTableProps<T>) => {
  const { dealType } = useParams();

  const { table, filtersContextValue, openFilters } = useTableState(
    data,
    columns
  );

  const { columnFilters } = table.getState();

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;

  // Получаем текущие данные (с учётом всех применённых фильтров/сортировок)
  const currentData = table.getRowModel().rows.map((row) => row.original);

  // Получаем исходные данные (без фильтров/сортировок)
  const originalData = table.getCoreRowModel().rows.map((row) => row.original);
  return (
    <DataTableFiltersProvider value={filtersContextValue}>
      <div className="relative grid w-full overflow-auto rounded-lg border bg-background p-2 auto-rows-max">
        <div className="flex items-center justify-between gap-2 pb-2">

           <ButtonExportTableXls isShow={currentData.length > 0} table={table} columns={columns} />

          <FiltersManagement openFilters={openFilters} isShow={originalData.length > 0}/>

          <AddNewDeal type={dealType as string} />
        </div>
        <div
          className={`grid overflow-hidden transition-all duration-200 ${openFilters ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"}`}
        >
          {originalData.length > 0 && openFilters && (
            <>
              <Filters value={value} />
            </>
          )}
        </div>

        {data?.length ? (
          <OrdersTableBody
            table={table}
            openFilters={openFilters}
            hasEditDeleteActions={hasEditDeleteActions}
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

const Filters = ({ value }: { value: DateRange | undefined }) => {
  const { handleDateChange, handleClearDateFilter } =
    useDataTableFiltersContext();

  return (
    <div className="py-2 flex flex-wrap justify-start gap-2">
      <FilterByUsers label="Менеджер" />

      <div className="flex gap-2 justify-start flex-wrap">
        <DateRangeFilter
          onDateChange={handleDateChange("dateRequest")}
          onClearDateFilter={handleClearDateFilter}
          value={value}
        />

        <FilterPopoverRadio
          key="orderStatus"
          columnId="orderStatus"
          options={STATUS_ORDER}
          label="Статус"
        />
      </div>
    </div>
  );
};
