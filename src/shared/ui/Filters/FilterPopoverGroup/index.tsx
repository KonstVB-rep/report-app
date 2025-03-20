
import { ColumnFiltersState } from "@tanstack/react-table";
import React from "react";
import FilterPopover from "../FilterPopover";

export type OptionGroup = {
  label: string;
  columnId: string;
  options: Record<string, string>; // ключи и значения из передаваемого объекта
};

type FilterPopoverGroupProps = {
  options: OptionGroup[]; // Массив групп опций
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
};

const FilterPopoverGroup = React.memo(({
  options,
  columnFilters,
  setColumnFilters,
}: FilterPopoverGroupProps) => {

  return (
    <div className="flex flex-wrap items-center justify-start gap-2 py-2 bg-background">
      {options.map((option) => (
        <FilterPopover
          key={option.columnId}
          columnId={option.columnId}
          options={option.options}
          label={option.label}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
      ))}
    </div>
  );
});

FilterPopoverGroup.displayName = "FilterPopoverGroup";

export default FilterPopoverGroup;
