import { ReactNode } from "react";

import {
  DataTableFiltersContext,
  DataTableFiltersContextType,
} from "./useDataTableFiltersContext";

export const DataTableFiltersProvider = <
  TData extends Record<string, unknown>,
  TValue = unknown,
>({
  children,
  value,
}: {
  children: ReactNode;
  value: DataTableFiltersContextType<TData, TValue>;
}) => {
  return (
    <DataTableFiltersContext.Provider
      value={
        value as unknown as DataTableFiltersContextType<Record<string, unknown>>
      }
    >
      {children}
    </DataTableFiltersContext.Provider>
  );
};
