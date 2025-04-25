import { ColumnFiltersState } from "@tanstack/react-table";

import React from "react";

import FilterPopover from "../FilterPopover";

export type OptionGroup = {
  label: string;
  columnId: string;
  options: Record<string, string>;
};

type FilterPopoverGroupProps = {
  options: OptionGroup[];
  columnFilters: ColumnFiltersState;
  setColumnFilters: (
    callback: (prev: ColumnFiltersState) => ColumnFiltersState
  ) => void;
};

const FilterPopoverGroup = React.memo(
  ({ options, columnFilters, setColumnFilters }: FilterPopoverGroupProps) => {
    return (
      <div className="flex flex-wrap items-center justify-start gap-2 bg-background py-2">
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
  }
);

FilterPopoverGroup.displayName = "FilterPopoverGroup";

export default FilterPopoverGroup;
