import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";

import { startTransition } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import { usePathname, useRouter } from "next/navigation";

import { utilsDataTable } from "../lib/utilsDataTable";

type Props = {
  searchParams: URLSearchParams;
  includedColumns: string[];
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
};

const useDataTableFilters = ({
  searchParams,
  includedColumns,
  setColumnFilters,
  setColumnVisibility,
  columnFilters,
  columnVisibility,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() =>
    utilsDataTable.transformParamsListToSFiltersObj(
      searchParams.toString(),
      includedColumns
    )
  );
  const [filterValueSearchByCol, setFilterValueSearchByCol] = useState<string>(
    () =>
      utilsDataTable.transformParamsListToStringArr(
        searchParams.toString(),
        includedColumns
      )[0] || ""
  );

  const [openFilters, setOpenFilters] = useState(false);

  const handleDateChange = useCallback(
    (date: DateRange | undefined) => {
      setColumnFilters((prev) => {
        const newFilters = prev.filter((f) => f.id !== "dateRequest");
        return date?.from && date?.to
          ? ([
              ...newFilters,
              { id: "dateRequest", value: { from: date.from, to: date.to } },
            ] as ColumnFiltersState)
          : newFilters;
      });
    },
    [setColumnFilters]
  );

  const handleClearDateFilter = useCallback(
    (columnId: string) => {
      setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
    },
    [setColumnFilters]
  );

  useEffect(() => {
    const initialFilters = utilsDataTable.parsedParams(
      decodeURIComponent(searchParams.get("filters") || "")
    );
    const initialVisibility = utilsDataTable.parsedHoddenColsFilter(
      decodeURIComponent(searchParams.get("hidden") || "")
    );

    if (initialFilters.length) {
      setColumnFilters(initialFilters);
    }
    if (Object.keys(initialVisibility).length) {
      setColumnVisibility(initialVisibility);
    }
  }, [searchParams, setColumnFilters, setColumnVisibility]);

  useEffect(() => {
    const filtersString = utilsDataTable.paramsFiltersToString(columnFilters);
    const visibilityString =
      utilsDataTable.transformHiddenColsFilterToString(columnVisibility);

    const queryParams = new URLSearchParams(searchParams.toString());

    if (filtersString) {
      queryParams.set("filters", filtersString);
    } else {
      queryParams.delete("filters");
    }

    if (visibilityString) {
      queryParams.set("hidden", visibilityString);
    } else {
      queryParams.delete("hidden");
    }

    startTransition(() =>
      router.replace(`${pathname}?${queryParams.toString()}`)
    );
  }, [columnFilters, columnVisibility, pathname, router, searchParams]);

  return {
    selectedColumns,
    setSelectedColumns,
    filterValueSearchByCol,
    setFilterValueSearchByCol,
    openFilters,
    setOpenFilters,
    handleDateChange,
    handleClearDateFilter,
  };
};

export default useDataTableFilters;
