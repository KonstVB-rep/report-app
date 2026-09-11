import type { Table } from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"
import { DealTypeLabels } from "@/feature/deals/lib/constants"
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext"
import FilterPopover from "@/feature/filter-persistence/ui/FilterPopover"
import DateRangeFilter from "@/shared/custom-components/ui/DateRangeFilter"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import SelectColumns from "@/shared/custom-components/ui/SelectColumns"

const OptionDealType = Object.entries(DealTypeLabels).map(([key, label]) => ({
  id: key,
  label,
}))

interface FiltersProps<T = unknown> {
  table: Table<T>
}

const Filters = <T = unknown>({ table }: FiltersProps<T>) => {
  const { handleDateChange, handleClearDateFilter } = useDataTableFiltersContext()

  const { columnFilters } = table.getState()

  const dateRequestValue = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined

  return (
    <MotionDivY className="min-h-0">
      <div className="flex flex-wrap justify-start items-center gap-2 py-2">
        <DateRangeFilter
          label="Дата заявки"
          onClearDateFilter={handleClearDateFilter}
          onDateChange={handleDateChange("dateRequest")}
          value={dateRequestValue}
        />

        <SelectColumns data={table} />

        <FilterPopover columnId="type" label={"Тип"} options={OptionDealType} />
      </div>
    </MotionDivY>
  )
}

export default Filters
