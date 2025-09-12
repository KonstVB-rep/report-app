import { rankItem } from "@tanstack/match-sorter-utils";
import {
  ColumnDef,
  FilterFn,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { useMemo, useState } from "react";

import useDataTableFilters from "@/feature/deals/api/hooks/useDataTableFilters";

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

export const useTableState = <T extends Record<string, unknown>>(
  data: T[], // принимаем данные любого типа, соответствующего Record<string, unknown>
  columns: ColumnDef<T>[] // и колонки для этого типа
) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({})
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const {
    selectedColumns,
    setSelectedColumns,
    filterValueSearchByCol,
    setFilterValueSearchByCol,
    openFilters,
    setOpenFilters,
    handleDateChange,
    handleClearDateFilter,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    includedColumns,
    globalFilter,
    setGlobalFilter,
  } = useDataTableFilters();

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    filterFns: {
      fuzzy: fuzzyFilter, // Возможно, тебе нужно будет уточнить, что такое fuzzyFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      globalFilter,
      columnVisibility: {
        ...columnVisibility,
        user: false,
        id: false
      },
    },
    meta: {
      columnVisibility: {
        resource: false, // например скрыть колонку с id 'resource'
      },
    },
    //   defaultColumn: {
    //   size: 0,      // убираем дефолтные 150px
    //   minSize: 0,
    //   // maxSize: Number.MAX_SAFE_INTEGER,
    // },
  });

  const filtersContextValue = {
    selectedColumns,
    setSelectedColumns,
    filterValueSearchByCol,
    setFilterValueSearchByCol,
    openFilters,
    setOpenFilters,
    handleDateChange,
    handleClearDateFilter,
    columnFilters,
    columnVisibility,
    setColumnFilters,
    setColumnVisibility,
    includedColumns,
    columns: memoizedColumns,
  };

  return { table, filtersContextValue, openFilters, setGlobalFilter };
};
