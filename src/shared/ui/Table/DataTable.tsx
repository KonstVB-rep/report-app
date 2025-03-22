"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  ColumnDef,
} from "@tanstack/react-table";
import SelectColumns from "../SelectColumns";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "../DateRangeFilter";
import { DealTypeLabels, LABELS } from "@/entities/deal/lib/constants";
import MultiColumnFilter from "../MultiColumnFilter";
import TableComponent from "./TableComponent";
import FilterPopoverGroup from "../Filters/FilterPopoverGroup";
import FilterByUser from "../Filters/FilterByUsers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import TooltipComponent from "../TooltipComponent";

// Преобразование параметров фильтра в строку URL
const paramsToString = (arr: ColumnFiltersState) =>
  arr
    .map(
      (item) => `${item.id}=${encodeURIComponent(JSON.stringify(item.value))}`
    )
    .join("&");

// Разбор строки URL в объект фильтров
const parsedParams = (str: string) => {
  if (!str) return [];
  return str.split("&").map((item) => {
    const [filterName, filterValue] = item.split("=");
    let value = filterValue.split(",");
    try {
      value = JSON.parse(decodeURIComponent(filterValue));
    } catch (e) {
      console.error("Ошибка при разборе фильтров:", e);
    }
    return { id: filterName, value };
  });
};

// Преобразование скрытых колонок в строку URL
const visibilityToString = (visibility: VisibilityState) =>
  Object.entries(visibility)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, isVisible]) => !isVisible)
    .map(([key]) => key)
    .join(",");

// Разбор строки URL в объект скрытых колонок
const parsedVisibility = (str: string) => {
  if (!str) return {};
  return Object.fromEntries(str.split(",").map((key) => [key, false]));
};

interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowLink?: (row: TData & { id: string }, type: string) => string;
  type: keyof typeof DealTypeLabels;
}

const DataTable = <TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  getRowLink,
  type,
}: DataTableProps<TData, TValue>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const handleDateChange = (date: DateRange | undefined) => {
    setColumnFilters((prev) => {
      const newFilters = prev.filter((f) => f.id !== "dateRequest");

      if (date?.from && date?.to) {
        return [
          ...newFilters,
          { id: "dateRequest", value: { from: date.from, to: date.to } },
        ];
      }

      return newFilters;
    });
  };

  const handleClearDateFilter = (columnId: string) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
  };

  useEffect(() => {
    const initialFilters = parsedParams(
      decodeURIComponent(searchParams.get("filters") || "")
    );
    const initialVisibility = parsedVisibility(
      decodeURIComponent(searchParams.get("hidden") || "")
    );

    if (initialFilters.length) {
      setColumnFilters(initialFilters);
    }
    if (Object.keys(initialVisibility).length) {
      setColumnVisibility(initialVisibility);
    }
  }, [searchParams]);

  // Сохраняем фильтры и скрытые колонки в URL при изменении
  useEffect(() => {
    const filtersString = paramsToString(columnFilters);
    const visibilityString = visibilityToString(columnVisibility);

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

    router.replace(`${pathname}?${queryParams.toString()}`);
  }, [columnFilters, columnVisibility, pathname, router, searchParams]);

  return (
    <div className="relative flex max-h-[80vh] w-full flex-col overflow-auto rounded-lg border bg-background p-2">
      <div className="pb-2">
        <FilterByUser
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      </div>
      <div className="flex justify-between gap-2">
        <DateRangeFilter
          onDateChange={handleDateChange}
          onClearDateFilter={handleClearDateFilter}
          value={value}
        />
        <MultiColumnFilter
          columns={columns}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          includedColumns={[
            "nameObject",
            "nameDeal",
            "contact",
            "phone",
            "email",
            "additionalContact",
            "comments",
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 bg-background">
        <div className="flex flex-wrap items-center justify-start gap-2 bg-background">
          <FilterPopoverGroup
            options={[
              {
                label: "Статус",
                columnId: "projectStatus",
                options: LABELS[type].STATUS,
              },
              {
                label: "Направление",
                columnId: "direction",
                options: LABELS[type].DIRECTION,
              },
              {
                label: "Тип поставки",
                columnId: "deliveryType",
                options: LABELS[type].DELIVERY,
              },
            ]}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
          <SelectColumns data={table} />
        </div>
        {searchParams.size > 0 && (
          <TooltipComponent content="Сбросить фильтры">
            <Button
              variant={"destructive"}
              size={"icon"}
              className="transition-transform duration-150 active:scale-95"
              onClick={() => {
                setColumnFilters([]);
                setColumnVisibility({});
              }}
            >
              <X />
            </Button>
          </TooltipComponent>
        )}
      </div>
      <TableComponent data={data} getRowLink={getRowLink} table={table} />
    </div>
  );
};

export default DataTable;
