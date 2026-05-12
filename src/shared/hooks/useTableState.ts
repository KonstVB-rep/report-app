// src/shared/hooks/useTableState.ts

import { useEffect, useMemo, useState } from "react"
import {
  type ColumnDef,
  type ColumnSizingInfoState,
  type ColumnSizingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  type TableOptions,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import useDataTableFilters from "@/feature/deals/api/hooks/useDataTableFilters"

export const getLS = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const setLS = (key: string, value: unknown) => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

interface UseTableStateOptions<T> extends Partial<TableOptions<T>> {
  hiddenColumns?: Partial<Record<string, boolean>>
  paramsNotFilters?: string[]
  storageKey?: string
}

export const useTableState = <T extends { id: string }>(
  data: T[],
  columns: ColumnDef<T>[],
  options: UseTableStateOptions<T> = {},
) => {
  const { hiddenColumns, paramsNotFilters, ...tableOptions } = options
  const storageKey = options.storageKey ?? ""

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() =>
    getLS(`${storageKey}_columnSizing`, {}),
  )
  const [_columnSizingInfo, setColumnSizingInfo] = useState<ColumnSizingInfoState>(
    {} as ColumnSizingInfoState,
  )

  useEffect(() => {
    setLS(`${storageKey}_columnSizing`, columnSizing)
  }, [columnSizing, storageKey])
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
  } = useDataTableFilters(paramsNotFilters)

  const mergedColumnVisibility = useMemo<VisibilityState>(() => {
    const hiddenColsObj = hiddenColumns
      ? Object.fromEntries(Object.entries(hiddenColumns).map(([key, value]) => [key, !!value]))
      : {}

    return {
      ...visibilityFromHook,
      ...hiddenColsObj,
    }
  }, [visibilityFromHook, hiddenColumns])

  const tableState = useMemo(() => {
    return {
      sorting,
      rowSelection,
      columnFilters,
      globalFilter,
      columnVisibility: mergedColumnVisibility,
      columnSizing,
    }
  }, [sorting, rowSelection, columnFilters, globalFilter, mergedColumnVisibility, columnSizing])

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnSizingChange: setColumnSizing,
    onColumnSizingInfoChange: setColumnSizingInfo,
    enableRowSelection: true,
    enableColumnResizing: false,
    columnResizeMode: "onChange",

    state: tableState,

    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,

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
