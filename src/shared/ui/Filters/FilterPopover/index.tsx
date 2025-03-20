import React, { useState, useTransition } from "react";
import { Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  columnId: string;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: (
    callback: (prev: ColumnFiltersState) => ColumnFiltersState
  ) => void;
  options: Record<string, string> | { id: string; label: string }[];
  label: string;
};

const FilterPopover = React.memo(({
  columnId,
  columnFilters,
  setColumnFilters,
  options,
  label,
}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

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
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className={`${
          filterValues.length > 0 ? "border-solid" : "border-dashed"
        } border-muted-foreground`}
      >
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          {label}
          {filterValues.length > 0 && (
            <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 h-4 w-4 inline-flex items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
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
                className="flex items-center gap-1 text-sm w-fit px-1"
              >
                <Checkbox
                  id={id}
                  checked={filterValues.includes(id)}
                  onCheckedChange={() => handleChange(id)}
                  // className="h-5 w-5 data-[state=checked]:bg-primary"
                />
                <label htmlFor={id} className="whitespace-nowrap cursor-pointer">
                  {label}
                </label>
              </div>
            ))}
          </div>
          {filterValues.length > 0 && (
            <Button onClick={handleClear} variant="outline" className="w-full btn_hover text-xs">
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
