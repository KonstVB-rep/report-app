"use client";

import { ColumnDef, ColumnFiltersState, Row } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";

import { useCallback, useRef } from "react";
import { DateRange } from "react-day-picker";

import { getManagers } from "@/entities/department/lib/utils";
import { columnsDataTask } from "@/entities/task/model/column-data-tasks";
import { TaskWithUserInfo } from "@/entities/task/types";
import { DataTableFiltersProvider } from "@/feature/filter-persistence/context/DataTableFiltersProvider";
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext";
import FilterByUsers from "@/feature/filter-persistence/ui/FilterByUsers";
import FilterPopoverGroup from "@/feature/filter-persistence/ui/FilterPopoverGroup";
import { LABEL_TASK_STATUS } from "@/feature/task/model/constants";
import DelTaskDialogContextMenu from "@/feature/task/ui/Modals/DelTaskDialogContextMenu";
import EditTaskDialogContextMenu from "@/feature/task/ui/Modals/EditTaskDialogContextMenu";
import DateRangeFilter from "@/shared/custom-components/ui/DateRangeFilter";
import {
  TableContextType,
  TableProvider,
} from "@/shared/custom-components/ui/Table/context/TableContext";
import TableRowDealOrTask from "@/shared/custom-components/ui/Table/TableRowDealOrTask";
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate";
import VirtualRow from "@/shared/custom-components/ui/Table/VirtualRow";
import { useTableState } from "@/shared/hooks/useTableState";
import useVirtualizedRowTable from "@/shared/hooks/useVirtualizedRowTable";

interface TaskTableProps<TData extends TaskWithUserInfo> {
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
      []
    );

  const { table, filtersContextValue } = useTableState(
    data,
    columnsDataTask as ColumnDef<T>[]
  );

  const { rows } = table.getRowModel();

  const { columnFilters } = table.getState();

  const { virtualItems, totalSize } = useVirtualizedRowTable<T>({
    rows,
    tableContainerRef,
  });

  if (rows.length === 0) {
    return (
      <div className="py-4">
        <div className="flex items-center justify-center flex-wrap gap-2 p-2 border-b border-t border-border mb-2">
          <h1 className="text-xl text-center w-full uppercase text-muted-foreground">
            Список задач пуст
          </h1>
        </div>
      </div>
    );
  }
  return (
    <DataTableFiltersProvider value={filtersContextValue}>
      <div className="relative grid w-full overflow-hidden rounded-md border bg-background">
        <div className="flex items-center flex-wrap gap-2 p-2 border-b mb-2">
          <div className="flex items-center">
            <FilterByUsers
              label="Исполнитель"
              columnId="executorId"
              managers={getManagers()}
            />
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
              className="rounded-md"
              totalSize={totalSize}
            >
              <VirtualRow<T>
                rows={rows}
                virtualItems={virtualItems}
                renderRow={({
                  row,
                  virtualRow,
                }: {
                  row: Row<T>;
                  virtualRow: VirtualItem;
                }) => (
                  <TableRowDealOrTask<T>
                    key={row.id}
                    row={row}
                    virtualRow={virtualRow}
                    entityType={"task"}
                    headers={table.getHeaderGroups()[0].headers}
                  />
                )}
              />
            </TableTemplate>
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
        label="Дата"
      />
    </>
  );
};
