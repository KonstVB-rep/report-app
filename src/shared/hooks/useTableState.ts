import { ColumnDef, SortingState, useReactTable, getFilteredRowModel, getSortedRowModel, getCoreRowModel, FilterFn } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DealBase } from "../ui/Table/model/types";
import useDataTableFilters from "@/entities/deal/hooks/useDataTableFilters";
import { rankItem } from "@tanstack/match-sorter-utils";
import { DataTableFiltersContextType } from "@/feature/tableFilters/context/useDataTableFiltersContext";

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};


export const useTableState = <T extends DealBase>(
  data: T[],
  columns: ColumnDef<T>[],
) => {
   const [sorting, setSorting] = useState<SortingState>([]);  
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
        fuzzy: fuzzyFilter,
      },
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      enableColumnResizing: true,
      columnResizeMode: "onChange",
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: "includesString",
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
      state: {
        sorting,
        columnFilters,
        globalFilter,
        columnVisibility: {
          ...columnVisibility,
          user: false,
          // resource: false // Скрываем колонку с id 'user'
        },
      },
      meta: {
        columnVisibility: {
          resource: false,
          // user: false,
        },
      },
    });

     const filtersContextValue: DataTableFiltersContextType<T> = {
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

  return {table,filtersContextValue, openFilters,setGlobalFilter};
};