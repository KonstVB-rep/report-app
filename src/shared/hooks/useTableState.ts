// src/shared/hooks/useTableState.ts

import { useMemo, useState } from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import useDataTableFilters from "@/feature/deals/api/hooks/useDataTableFilters"

export interface TableMeta<TData> {
  columnVisibility: Partial<Record<Extract<NonNullable<ColumnDef<TData>["id"]>, string>, boolean>>
}

export const useTableState = <T extends Record<string, unknown>>(
  data: T[],
  columns: ColumnDef<T>[],
  hiddenColumns?: Partial<Record<Extract<NonNullable<ColumnDef<T>["id"]>, string>, boolean>>,
) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})

  const {
    columnFilters,
    setColumnFilters,
    columnVisibility: visibilityFromHook,
    setColumnVisibility,
    globalFilter,
    setGlobalFilter,
    openFilters,
    setOpenFilters,
    handleDateChange,
    handleClearDateFilter,
    selectedSearchColumns,
    setSelectedSearchColumns,
    searchableColumns,
  } = useDataTableFilters()

  const columnVisibility = useMemo(() => {
    const visibility: VisibilityState = { ...visibilityFromHook }

    ;(["id", "user", "resource"] as const).forEach((col) => {
      if (!(col in visibility)) {
        visibility[col] = false
      }
    })

    return visibility
  }, [visibilityFromHook])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    meta: {
      columnVisibility: {
        user: false,
        id: false,
        ...hiddenColumns,
      },
    } as TableMeta<T>,
  })

  const filtersContextValue = {
    selectedColumns: selectedSearchColumns,
    setSelectedColumns: setSelectedSearchColumns,
    openFilters,
    setOpenFilters,
    handleDateChange,
    handleClearDateFilter,
    columnFilters,
    columnVisibility,
    setColumnFilters,
    setColumnVisibility,
    includedColumns: searchableColumns,
    columns,
  }

  return {
    table,
    filtersContextValue,
    openFilters,
    setGlobalFilter,
    globalFilter: table.getState().globalFilter ?? "",
  }
}
