import type { ReactNode } from "react"
import {
  DataTableFiltersContext,
  type DataTableFiltersContextType,
} from "./useDataTableFiltersContext"

export const DataTableFiltersProvider = <T = unknown>({
  children,
  value,
}: {
  children: ReactNode
  value: DataTableFiltersContextType<T>
}) => {
  return (
    <DataTableFiltersContext.Provider
      value={value as unknown as DataTableFiltersContextType<Record<string, unknown>>}
    >
      {children}
    </DataTableFiltersContext.Provider>
  )
}
