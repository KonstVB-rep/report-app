import { Table } from "@tanstack/react-table";

import React from "react";
import { DateRange } from "react-day-picker";

import { DealBase } from "@/entities/deal/types";
import { getManagers } from "@/entities/department/lib/utils";
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext";
import DateRangeFilter from "@/shared/custom-components/ui/DateRangeFilter";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import SelectColumns from "@/shared/custom-components/ui/SelectColumns";
import FilterByUser from "@/feature/filter-persistence/ui/FilterByUsers";

const Filters = ({ table }: { table: Table<DealBase> }) => {
  const { handleDateChange, handleClearDateFilter } =
    useDataTableFiltersContext();

  const { columnFilters } = table.getState();

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;
  return (
      <MotionDivY className="min-h-0">
        <div className="py-2 flex flex-wrap justify-start gap-2">
          <FilterByUser label="Менеджер" managers={getManagers()} />

          <div className="flex gap-2 justify-start flex-wrap">
            <DateRangeFilter
              onDateChange={handleDateChange("dateRequest")}
              onClearDateFilter={handleClearDateFilter}
              value={value}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 bg-background">
          <SelectColumns data={table as Table<DealBase>} />
        </div>
      </MotionDivY>
  );
};

export default Filters;
