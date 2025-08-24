import { ReactNode } from "react";

import {
  DataTableFiltersContext,
  DataTableFiltersContextType,
} from "./useDataTableFiltersContext";

export const DataTableFiltersProvider = <
  TData extends Record<string, unknown>,
>({
  children,
  value,
}: {
  children: ReactNode;
  value: DataTableFiltersContextType<TData>;
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
