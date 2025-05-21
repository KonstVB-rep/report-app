import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";

import React, { useEffect, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import DebouncedInput from "../DebouncedInput";

type FilterKeys =
  | "nameDeal"
  | "nameObject"
  | "contact"
  | "phone"
  | "email"
  | "comments";

const filtersByColLabel: Record<FilterKeys, string> = {
  nameDeal: "Название сделки",
  nameObject: "Название объекта",
  contact: "Контактное лицо",
  phone: "Телефон",
  email: "Email",
  comments: "Комментарии",
};

type MultiColumnFilterProps<
  TData extends Record<string, unknown>,
  TValue = unknown,
> = {
  columns: ColumnDef<TData, TValue>[];
  includedColumns: string[];
  selectedColumns: string[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  filterValueSearchByCol: string;
  setFilterValueSearchByCol: React.Dispatch<React.SetStateAction<string>>;
  setColumnFilters: (
    callback: (prev: ColumnFiltersState) => ColumnFiltersState
  ) => void;
};

const MultiColumnFilter = <
  TData extends Record<string, unknown>,
  TValue = unknown,
>({
  columns,
  includedColumns = [],
  selectedColumns,
  setSelectedColumns,
  filterValueSearchByCol,
  setFilterValueSearchByCol,
  setColumnFilters,
}: MultiColumnFilterProps<TData, TValue>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filteredColumns = useMemo(
    () =>
      columns.filter(
        (column) => !!column.id && includedColumns.includes(column.id)
      ),
    [columns, includedColumns]
  );

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Формируем строку с фильтрами
    if (selectedColumns.length > 0 && filterValueSearchByCol) {
      // Получаем текущие фильтры
      const existingFilters = newParams.get("filters");

      // Если фильтры есть
      if (existingFilters) {
        const filterArray = existingFilters.split("&");
        let filterUpdated = false;

        const updatedFilters = filterArray.map((filter) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [key, value] = filter.split("=");

          // Если фильтр для этого столбца, обновляем его
          if (selectedColumns.includes(key)) {
            filterUpdated = true; // Фильтр обновлен
            return `${key}="${encodeURIComponent(filterValueSearchByCol)}"`;
          }

          // Если фильтр для другого столбца, оставляем без изменений
          return filter;
        });

        // Если фильтра для этого столбца не было, добавляем новый
        if (!filterUpdated) {
          updatedFilters.push(
            `${selectedColumns[0]}="${encodeURIComponent(filterValueSearchByCol)}"`
          );
        }

        // Преобразуем обновленные фильтры обратно в строку
        newParams.set("filters", updatedFilters.join("&"));
      } else {
        // Если фильтров нет, просто добавляем их
        newParams.set(
          "filters",
          `${selectedColumns[0]}="${encodeURIComponent(filterValueSearchByCol)}"`
        );
      }
    }

    const newUrl = `${pathname}?${newParams.toString()}`;
    const currentUrl = `${pathname}?${searchParams.toString()}`;

    if (newUrl !== currentUrl) {
      router.replace(newUrl);
    }
  }, [selectedColumns, filterValueSearchByCol, pathname, router, searchParams]);

  const handleClear = () => {
    setSelectedColumns([]);
    setFilterValueSearchByCol("");

    setColumnFilters((prevFilters) =>
      prevFilters.filter((filter) => !selectedColumns.includes(filter.id))
    );
  };

  const handleCheckboxChange = (columnId: string) => {
    setSelectedColumns((prev: string[]) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );

    if (selectedColumns.includes(columnId)) {
      setColumnFilters((prevFilters) =>
        prevFilters.filter((filter) => filter.id !== columnId)
      );
    }
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger
          asChild
          className={`border-muted-foreground ${selectedColumns.length > 0 ? "border-solid" : "border-dashed"}`}
        >
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            <span>Поиск в колонках</span>
            {selectedColumns.length > 0 && (
              <span className="absolute -left-2 top-0 inline-flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {selectedColumns.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border- relative top-1 z-50 w-fit rounded-md border border-solid bg-popover p-2">
          <div className="grid gap-4">
            <DebouncedInput
              type="text"
              value={filterValueSearchByCol}
              onChange={(value: string) => setFilterValueSearchByCol(value)}
              placeholder="Поиск..."
              className="w-36 rounded border shadow"
            />
            <div className="grid grid-cols-1 items-center gap-1">
              {filteredColumns.map(({ id }) => {
                if (!id) return null;
                return (
                  <div
                    key={id}
                    className="flex w-fit items-center gap-1 px-1 text-sm"
                  >
                    <Checkbox
                      key={`checkbox-${id}`}
                      id={id}
                      checked={selectedColumns.includes(id)}
                      onCheckedChange={() => handleCheckboxChange(id)}
                    />
                    <label
                      htmlFor={id}
                      className="ml-2 cursor-pointer text-sm font-medium leading-none"
                    >
                      {filtersByColLabel[id as FilterKeys]}
                    </label>
                  </div>
                );
              })}
            </div>
            {selectedColumns.length > 0 && (
              <Button
                onClick={handleClear}
                variant="outline"
                className="w-full text-xs"
              >
                Очистить фильтр
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiColumnFilter;
