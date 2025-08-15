import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";

import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { DateRange } from "react-day-picker";

export type DataTableFiltersContextType<TData, TValue = unknown> = {
  selectedColumns: string[];
  setSelectedColumns: Dispatch<SetStateAction<string[]>>;
  filterValueSearchByCol: string;
  setFilterValueSearchByCol: Dispatch<SetStateAction<string>>;
  openFilters: boolean;
  setOpenFilters: Dispatch<SetStateAction<boolean>>;
  handleDateChange: (columnId: string) => (range?: DateRange) => void;
  handleClearDateFilter: (columnId: string) => void;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>;
  includedColumns: string[];
  columns: ColumnDef<TData, TValue>[];
};

// Создаем контекст с default-значением через as
export const DataTableFiltersContext =
  createContext<DataTableFiltersContextType<Record<string, unknown>> | null>(
    null as unknown as DataTableFiltersContextType<Record<string, unknown>>
  );

export const useDataTableFiltersContext = <
  TData extends Record<string, unknown>,
  TValue = unknown,
>() => {
  const context = useContext(
    DataTableFiltersContext as React.Context<
      DataTableFiltersContextType<TData, TValue>
    >
  );

  if (!context) {
    throw new Error(
      "useDataTableFiltersContext  must be used within a DataTableFiltersContext"
    );
  }
  return context;
};
