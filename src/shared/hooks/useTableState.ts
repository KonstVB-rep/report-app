// src/shared/hooks/useTableState.ts

import { useMemo, useState } from "react"
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  type TableOptions, // Импортируем типы
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import useDataTableFilters from "@/feature/deals/api/hooks/useDataTableFilters"

interface UseTableStateOptions<T> extends Partial<TableOptions<T>> {
  hiddenColumns?: Partial<Record<string, boolean>>
}

export const useTableState = <T extends { id: string }>(
  data: T[],
  columns: ColumnDef<T>[],
  options: UseTableStateOptions<T> = {},
) => {
  const { hiddenColumns, ...tableOptions } = options
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

  const mergedColumnVisibility = useMemo<VisibilityState>(() => {
    const hiddenColsObj = hiddenColumns
      ? Object.fromEntries(Object.entries(hiddenColumns).map(([key, value]) => [key, !!value]))
      : {}

    return {
      ...visibilityFromHook,
      ...hiddenColsObj,
    }
  }, [visibilityFromHook, hiddenColumns])

  const tableState = useMemo(
    () => ({
      sorting,
      rowSelection,
      columnFilters,
      globalFilter,
      columnVisibility: mergedColumnVisibility,
    }),
    [sorting, rowSelection, columnFilters, globalFilter, mergedColumnVisibility],
  )

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",

    state: tableState,

    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,

    ...tableOptions,
  })

  const filtersContextValue = useMemo(
    () => ({
      selectedColumns: selectedSearchColumns,
      setSelectedColumns: setSelectedSearchColumns,
      openFilters,
      setOpenFilters,
      handleDateChange,
      handleClearDateFilter,
      columnFilters,
      columnVisibility: visibilityFromHook,
      setColumnFilters,
      setColumnVisibility,
      includedColumns: searchableColumns,
      columns,
    }),
    [
      selectedSearchColumns,
      openFilters,
      columnFilters,
      visibilityFromHook,
      searchableColumns,
      columns,
      handleClearDateFilter,
      handleDateChange,
      setColumnFilters,
      setColumnVisibility,
      setOpenFilters,
      setSelectedSearchColumns,
    ],
  )

  return {
    table,
    filtersContextValue,
    openFilters,
    setGlobalFilter,
    globalFilter: table.getState().globalFilter ?? "",
  }
}
