import { ColumnFilter } from "@tanstack/react-table";

import React, { useState, useTransition } from "react";

import { Filter } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useDataTableFiltersContext } from "@/shared/custom-components/ui/Table/tableFilters/context/useDataTableFiltersContext";

type Props = {
  columnId: string;
  options: Record<string, string> | { id: string; label: string }[];
  label: string;
};

const FilterPopover = React.memo(({ columnId, options, label }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const { columnFilters, setColumnFilters } = useDataTableFiltersContext();

  const existingFilter: ColumnFilter | undefined = columnFilters?.find(
    (f) => f.id === columnId
  );
  const filterValues = (existingFilter?.value as string[]) || [];

  const normalizedOptions = Array.isArray(options)
    ? options
    : Object.entries(options).map(([id, label]) => ({ id, label }));

  const handleChange = (id: string) => {
    if (setColumnFilters) {
      startTransition(() => {
        setColumnFilters((prev) => {
          const existingFilter = prev.find((f) => f.id === columnId);

          let updatedValues = existingFilter
            ? [...(existingFilter.value as string[])]
            : [];

          if (updatedValues.includes(id)) {
            updatedValues = updatedValues.filter((s) => s !== id);
          } else {
            updatedValues.push(id);
          }

          if (updatedValues.length === 0) {
            return prev.filter((f) => f.id !== columnId);
          }

          return prev.some((f) => f.id === columnId)
            ? prev.map((f) =>
                f.id === columnId ? { ...f, value: updatedValues } : f
              )
            : [...prev, { id: columnId, value: updatedValues }];
        });
      });
    }
  };

  const handleClear = () => {
    if (setColumnFilters) {
      startTransition(() => {
        setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className={`${
          filterValues.length > 0 ? "border-solid" : "border-dashed"
        } border-muted-foreground`}
      >
        <Button variant="outline" className="relative h-auto">
          <Filter className="mr-2 h-4 w-4" />
          {label}
          {filterValues.length > 0 && (
            <span className="absolute right-0 top-0 inline-flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-primary bg-blue-700 text-xs font-medium text-white">
              {filterValues.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit px-1 pb-2">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 items-center gap-1">
            {normalizedOptions.map(({ id, label }) => (
              <div
                key={id}
                className="flex w-fit items-center gap-1 px-1 text-sm"
              >
                <Checkbox
                  id={id}
                  checked={filterValues.includes(id)}
                  onCheckedChange={() => handleChange(id)}
                />
                <Label
                  htmlFor={id}
                  className="cursor-pointer whitespace-nowrap capitalize"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
          {filterValues.length > 0 && (
            <Button
              onClick={handleClear}
              variant="outline"
              className="btn_hover w-full text-xs"
            >
              Очистить фильтр
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});

FilterPopover.displayName = "FilterPopover";

export default FilterPopover;
