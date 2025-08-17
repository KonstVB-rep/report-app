import { Row } from "@tanstack/react-table";

import { Context, createContext, useContext, useMemo } from "react";

export type TableContextType<T> = {
  getContextMenuActions: (
    setOpenModal: React.Dispatch<
      React.SetStateAction<"delete" | "edit" | null>
    >,
    row: Row<T>
  ) => {
    edit: React.ReactNode;
    delete: React.ReactNode;
  };
};

const TableContext = createContext<TableContextType<unknown> | null>(null);

function useTableContext<T>() {
  const context = useContext(
    TableContext as Context<TableContextType<T> | null>
  );
  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }
  return context as TableContextType<T>;
}

interface TableProviderProps<T> {
  children: React.ReactNode;
  getContextMenuActions: TableContextType<T>["getContextMenuActions"];
}

function TableProvider<T>({
  children,
  getContextMenuActions,
}: TableProviderProps<T>) {
  // Мемоизируем значение контекста
  const contextValue = useMemo<TableContextType<T>>(
    () => ({
      getContextMenuActions,
    }),
    [getContextMenuActions]
  );

  return (
    <TableContext.Provider value={contextValue as TableContextType<unknown>}>
      {children}
    </TableContext.Provider>
  );
}

export { TableProvider, useTableContext };
