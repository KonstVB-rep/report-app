import { ReactNode } from "react";

import {
  DataTableFiltersContext,
  DataTableFiltersContextType,
} from "./useDataTableFiltersContext";

export const DataTableFiltersProvider = <T,>({
  children,
  value,
}: {
  children: ReactNode;
  value: DataTableFiltersContextType<T>;
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
