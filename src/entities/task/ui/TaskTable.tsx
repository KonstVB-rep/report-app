"use client";

import { ColumnDef, ColumnFiltersState, Row } from "@tanstack/react-table";

import { useCallback, useRef } from "react";
import { DateRange } from "react-day-picker";

import DateRangeFilter from "@/shared/custom-components/ui/DateRangeFilter";
import FilterByUsers from "@/shared/custom-components/ui/Filters/FilterByUsers";
import FilterPopoverGroup from "@/shared/custom-components/ui/Filters/FilterPopoverGroup";
import {
  TableContextType,
  TableProvider,
} from "@/shared/custom-components/ui/Table/context/TableContext";
import { DataTableFiltersProvider } from "@/shared/custom-components/ui/Table/tableFilters/context/DataTableFiltersProvider";
import { useDataTableFiltersContext } from "@/shared/custom-components/ui/Table/tableFilters/context/useDataTableFiltersContext";
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate";
import { useTableState } from "@/shared/hooks/useTableState";

import { columnsDataTask } from "../model/column-data-tasks";
import { LABEL_TASK_STATUS } from "../model/constants";
import { TaskWithUserInfo } from "../types";
import DelTaskDialogContextMenu from "./Modals/DelTaskDialogContextMenu";
import EditTaskDialogContextMenu from "./Modals/EditTaskDialogContextMenu";

interface TaskTableProps<TData> {
  data: TData[];
}

const TaskTable = <T extends TaskWithUserInfo>({ data }: TaskTableProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  const getContextMenuActions: TableContextType<T>["getContextMenuActions"] =
    useCallback(
      (
        setOpenModal: React.Dispatch<
          React.SetStateAction<"delete" | "edit" | null>
        >,
        row: Row<T>
      ) => ({
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
      }),
      [] // Зависимости, если нужны
    );

  const { table, filtersContextValue } = useTableState(
    data,
    columnsDataTask as ColumnDef<T>[]
  );

  const { rows } = table.getRowModel();

  const { columnFilters } = table.getState();

  if (rows.length === 0) {
    return null;
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
          className="rounded-lg relative h-full overflow-auto max-h-[78vh] border transition-all duration-200"
          ref={tableContainerRef}
        >
          <TableProvider<T> getContextMenuActions={getContextMenuActions}>
            <TableTemplate
              table={table}
              tableContainerRef={tableContainerRef}
              className="rounded-ee-md"
              entityType="task"
            />
          </TableProvider>
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
