import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";

export type DataTableType<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
};

export type FilterPopoverProps = {
  columnFilters: ColumnFiltersState;
  setColumnFilters: (
    callback: (prev: ColumnFiltersState) => ColumnFiltersState
  ) => void;
};
