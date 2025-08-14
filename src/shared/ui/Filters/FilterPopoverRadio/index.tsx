import React, { useState, useTransition } from "react";

import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useDataTableFiltersContext } from "@/shared/ui/Table/tableFilters/context/useDataTableFiltersContext";

type Props = {
  columnId: string;
  options: Record<string, string> | { id: string; label: string }[];
  label: string;
};

const FilterPopover = React.memo(({ columnId, options, label }: Props) => {
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const { columnFilters, setColumnFilters } = useDataTableFiltersContext();

  const existingFilter = columnFilters?.find((f) => f.id === columnId);
  const selectedValue = existingFilter?.value as string | undefined;

  const normalizedOptions = Array.isArray(options)
    ? options
    : Object.entries(options).map(([id, label]) => ({ id, label }));

  const handleChange = (value: string) => {
    if (!setColumnFilters) return;

    startTransition(() => {
      setColumnFilters((prev) => {
        // Если выбрано текущее значение - очищаем фильтр
        if (selectedValue === value) {
          return prev;
        }

        // Иначе создаем новый фильтр с выбранным значением
        const oldFilters = prev.filter((f) => f.id !== columnId);
        return [...oldFilters, { id: columnId, value }];
      });
    });
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
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`relative h-auto ${
            selectedValue ? "border-solid" : "border-dashed"
          } border-muted-foreground`}
        >
          <Filter className="mr-2 h-4 w-4" />
          {label}
          {selectedValue && (
            <span className="absolute right-0 top-0 inline-flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-primary bg-blue-700 text-xs font-medium text-white">
              1
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2">
        <RadioGroup
          value={selectedValue || ""}
          onValueChange={handleChange}
          className="space-y-2"
        >
          {normalizedOptions.map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <RadioGroupItem value={id} id={id} />
              <Label htmlFor={id} className="cursor-pointer capitalize">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {selectedValue && (
          <Button
            onClick={handleClear}
            variant="outline"
            className="mt-3 w-full text-xs"
          >
            Очистить фильтр
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
});

FilterPopover.displayName = "FilterPopover";

export default FilterPopover;
