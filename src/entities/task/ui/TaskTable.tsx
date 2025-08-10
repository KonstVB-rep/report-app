"use client";

import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";

import {  useRef } from "react";
import { DateRange } from "react-day-picker";

import { DataTableFiltersProvider } from "@/feature/tableFilters/context/DataTableFiltersProvider";
import { useDataTableFiltersContext } from "@/feature/tableFilters/context/useDataTableFiltersContext";
import { useTableState } from "@/shared/hooks/useTableState";
import DateRangeFilter from "@/shared/ui/DateRangeFilter";
import FilterByUsers from "@/shared/ui/Filters/FilterByUsers";
import FilterPopoverGroup from "@/shared/ui/Filters/FilterPopoverGroup";
import TableTemplate from "@/shared/ui/Table/TableTemplate";

import { columnsDataTask } from "../model/column-data-tasks";
import { LABEL_TASK_STATUS } from "../model/constants";
import { TaskWithUserInfo } from "../types";

interface TaskTableProps<TData> {
  data: TData[];
}

const TaskTable = <T extends TaskWithUserInfo>({ data }: TaskTableProps<T>) => {

  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const { table, filtersContextValue } = useTableState(
    data,
    columnsDataTask as ColumnDef<T>[]
  );

   const { rows } = table.getRowModel();

  const { columnFilters } = table.getState();

  if(rows.length === 0) {
    return null
  }
  return (
    <DataTableFiltersProvider value={filtersContextValue}>
      <div className="relative grid w-full overflow-hidden rounded-md border bg-background">
        <div className="flex items-center flex-wrap gap-2 p-2 border-b mb-2">
          <div className="flex items-center">
            <FilterByUsers label="Исполнитель" columnId="executorId" />
          </div>
          <FilterTasks columnFilters={columnFilters} />
        </div>
        <div
          className="rounded-lg overflow-hidden border transition-all duration-200"
          ref={tableContainerRef}
          style={{
            overflow: "auto",
            position: "relative",
            height: "100%",
            maxHeight: "78vh",
          }}
        >
          <TableTemplate
            table={table}
            tableContainerRef={tableContainerRef}
            className="rounded-ee-md"
            entityType="task"

          />
        </div>
      </div>
    </DataTableFiltersProvider>
  );
};

export default TaskTable;

const FilterTasks = ({
  columnFilters,
}: {
  columnFilters: ColumnFiltersState;
}) => {
  const { handleDateChange, handleClearDateFilter } =
    useDataTableFiltersContext();

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;
  return (
    <>
      <FilterPopoverGroup
        options={[
          {
            label: "Статус",
            columnId: "taskStatus",
            options: LABEL_TASK_STATUS,
          },
        ]}
      />
      <DateRangeFilter
        onDateChange={handleDateChange("dueDate")}
        onClearDateFilter={handleClearDateFilter}
        value={value}
      />
    </>
  );
};
