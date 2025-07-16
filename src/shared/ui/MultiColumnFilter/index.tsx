import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import React, { useEffect, useMemo, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDataTableFiltersContext } from "@/feature/tableFilters/context/useDataTableFiltersContext";

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

const MultiColumnFilter = () => {
  const {
    includedColumns = [],
    selectedColumns,
    setSelectedColumns,
    filterValueSearchByCol,
    setFilterValueSearchByCol,
    setColumnFilters,
    columns,
  } = useDataTableFiltersContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [col, setCol] = useState("");

  const filteredColumns = useMemo(
    () =>
      columns.filter(
        (column) => !!column.id && includedColumns.includes(column.id)
      ),
    [columns, includedColumns]
  );

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (selectedColumns.length > 0 && filterValueSearchByCol) {
      // Всегда сохраняем как массив в JSON
      const filterValue = JSON.stringify([filterValueSearchByCol]);
      const encodedValue = encodeURIComponent(filterValue);

      if (newParams.has("filters")) {
        const existingFilters = newParams.get("filters")?.split("&") || [];

        // Удаляем старые фильтры для выбранных колонок
        const filtered = existingFilters.filter(
          (filter) => !selectedColumns.includes(filter.split("=")[0])
        );

        // Добавляем новые
        const updatedFilters = [
          ...filtered,
          ...selectedColumns.map((col) => {
            setCol(col);
            return `${col}=${encodedValue}`;
          }),
        ];

        newParams.set("filters", updatedFilters.join("&"));
      } else {
        newParams.set("filters", `${selectedColumns[0]}=${encodedValue}`);
      }
    } else if (selectedColumns.length === 0) {
      // Очищаем фильтры если нет выбранных колонок
      newParams.delete("filters");
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
    setCol("");
  };

  const handleRadioChange = (columnId: string) => {
    setSelectedColumns([columnId]); // ← выбираем только один столбец
    setCol(columnId);
  };

  useEffect(() => {
    const rawFilters = new URLSearchParams(searchParams.toString()).get(
      "filters"
    );
    if (!rawFilters) {
      setSelectedColumns([]);
      setFilterValueSearchByCol("");
      return;
    }

    const filters = rawFilters.split("&");
    const activeFilters = filters.filter((filter) => {
      const [col] = filter.split("=");
      return includedColumns.includes(col);
    });

    if (activeFilters.length > 0) {
      const [firstFilter] = activeFilters;
      const [col, encoded = ""] = firstFilter.split("=");

      try {
        const decoded = decodeURIComponent(encoded);
        const value = JSON.parse(decoded);
        setSelectedColumns([col]);
        setFilterValueSearchByCol(Array.isArray(value) ? value[0] : value);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setSelectedColumns([col]);
        setFilterValueSearchByCol(decodeURIComponent(encoded));
      }
    } else {
      setSelectedColumns([]);
      setFilterValueSearchByCol("");
    }
  }, [
    searchParams,
    includedColumns,
    setSelectedColumns,
    setFilterValueSearchByCol,
  ]);

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger
          asChild
          className={`border-muted-foreground ${selectedColumns.length > 0 ? "border-solid" : "border-dashed"}`}
        >
          <Button variant="outline" className="relative h-auto">
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
            <RadioGroup
              value={col}
              className="grid grid-cols-1 items-center gap-1"
              onValueChange={handleRadioChange}
            >
              {filteredColumns.map(({ id }) => {
                if (!id) return null;
                return (
                  <div
                    key={id}
                    className="flex w-fit items-center gap-1 px-1 text-sm"
                  >
                    <RadioGroupItem id={`radio-${id}`} value={id} />
                    <label
                      htmlFor={`radio-${id}`}
                      className="ml-2 cursor-pointer text-sm font-medium leading-none"
                    >
                      {filtersByColLabel[id as FilterKeys]}
                    </label>
                  </div>
                );
              })}
            </RadioGroup>
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
