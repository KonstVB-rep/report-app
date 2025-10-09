import { Table } from "@tanstack/react-table";

import React from "react";
import { DateRange } from "react-day-picker";

import { DealBase } from "@/entities/deal/types";
import { getManagers } from "@/entities/department/lib/utils";
import { DealTypeLabels, LABELS } from "@/feature/deals/lib/constants";
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext";
import FilterByUser from "@/feature/filter-persistence/ui/FilterByUsers";
import FilterPopover from "@/feature/filter-persistence/ui/FilterPopover";
import DateRangeFilter from "@/shared/custom-components/ui/DateRangeFilter";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import SelectColumns from "@/shared/custom-components/ui/SelectColumns";

const OptionDealType = Object.entries(DealTypeLabels).map(([key, label]) => ({
  id: key,
  label,
}));

const Filters = ({ table }: { table: Table<DealBase> }) => {
  const { handleDateChange, handleClearDateFilter } =
    useDataTableFiltersContext();

  const { columnFilters } = table.getState();

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;
  return (
    <MotionDivY className="min-h-0">
      <div className="flex flex-wrap justify-start items-center gap-2 py-2">
        <FilterByUser
          label="Менеджер"
          managers={getManagers()}
          columnId="employee"
        />

        <DateRangeFilter
          onDateChange={handleDateChange("dateRequest")}
          onClearDateFilter={handleClearDateFilter}
          value={value}
          label="Дата заявки"
        />

        <SelectColumns data={table as Table<DealBase>} />

        <FilterPopover columnId="type" options={OptionDealType} label={"Тип"} />

        <FilterPopover
          columnId="dealStatusR"
          options={LABELS["RETAIL"].STATUS}
          label={"Статус розницы"}
        />

        <FilterPopover
          columnId="dealStatusP"
          options={LABELS["PROJECT"].STATUS}
          label={"Статус проекта"}
        />
      </div>
    </MotionDivY>
  );
};

export default Filters;
