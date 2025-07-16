import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";

import { startTransition, useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { utilsDataTable } from "../lib/utilsDataTable";

const includedColumns = [
  "nameObject",
  "nameDeal",
  "contact",
  "phone",
  "email",
  "comments",
];

const useDataTableFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
    (columnId: string) => (date: DateRange | undefined) => {
      setColumnFilters((prev) => {
        const newFilters = prev.filter((f) => f.id !== columnId);
        return date?.from && date?.to
          ? ([
              ...newFilters,
              { id: columnId, value: { from: date.from, to: date.to } },
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
    const initialVisibility = utilsDataTable.parsedHiddenColsFilter(
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
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    includedColumns,
  };
};

export default useDataTableFilters;
