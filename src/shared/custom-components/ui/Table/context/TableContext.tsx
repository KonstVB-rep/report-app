import { type Context, createContext, useContext, useMemo } from "react"
import type { Row } from "@tanstack/react-table"

export type TableContextType<T> = {
  getContextMenuActions: (row: Row<T>) => {
    edit: {
      onClick: () => void
    }
    delete: { onClick: () => void }
    more: { onClick: () => void }
  }
  renderAdditionalInfo?: (id: string) => React.ReactNode
  selectedDataItem: T | null
}

const TableContext = createContext<TableContextType<unknown> | null>(null)

function useTableContext<T>() {
  const context = useContext(TableContext as Context<TableContextType<T> | null>)
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider")
  }
  return context as TableContextType<T>
}

interface TableProviderProps<T> {
  children: React.ReactNode
  getContextMenuActions: TableContextType<T>["getContextMenuActions"]
  renderAdditionalInfo?: (id: string) => React.ReactNode
  selectedDataItem: T | null
}

function TableProvider<T>({
  children,
  getContextMenuActions,
  renderAdditionalInfo,
  selectedDataItem,
}: TableProviderProps<T>) {
  const contextValue = useMemo<TableContextType<T>>(
    () => ({
      getContextMenuActions,
      renderAdditionalInfo,
      selectedDataItem,
    }),
    [getContextMenuActions, renderAdditionalInfo, selectedDataItem],
  )

  return (
    <TableContext.Provider value={contextValue as TableContextType<unknown>}>
      {children}
    </TableContext.Provider>
  )
}

export { TableProvider, useTableContext }
