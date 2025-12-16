import { DealType } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import type { DateRange } from "react-day-picker"
import type { DealBase } from "@/entities/deal/types"
import { getUsers } from "@/entities/department/lib/utils"
import { DealTypeLabels, LABELS } from "@/feature/deals/lib/constants"
import { useDataTableFiltersContext } from "@/feature/filter-persistence/context/useDataTableFiltersContext"
import FilterByUser from "@/feature/filter-persistence/ui/FilterByUsers"
import FilterPopover from "@/feature/filter-persistence/ui/FilterPopover"
import DateRangeFilter from "@/shared/custom-components/ui/DateRangeFilter"
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY"
import SelectColumns from "@/shared/custom-components/ui/SelectColumns"

const OptionDealType = Object.entries(DealTypeLabels).map(([key, label]) => ({
  id: key,
  label,
}))

const Filters = ({ table }: { table: Table<DealBase> }) => {
  const { handleDateChange, handleClearDateFilter } = useDataTableFiltersContext()

  const { columnFilters } = table.getState()

  console.log(columnFilters, "columnFilters")

  const dateRequestValue = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined
  const type = columnFilters.find((f) => f.id === "type")?.value as DealType | undefined

  console.log(dateRequestValue, "dateRequestValue")
  return (
    <MotionDivY className="min-h-0">
      <div className="flex flex-wrap justify-start items-center gap-2 py-2">
        <FilterByUser columnId="employee" label="Менеджер" managers={getUsers()} />

        <DateRangeFilter
          label="Дата заявки"
          onClearDateFilter={handleClearDateFilter}
          onDateChange={handleDateChange("dateRequest")}
          value={dateRequestValue}
        />

        <SelectColumns data={table as Table<DealBase>} />

        <FilterPopover columnId="type" label={"Тип"} options={OptionDealType} />

        {type === DealType.PROJECT ? null : (
          <FilterPopover
            columnId="dealStatusR"
            label={"Статус розницы"}
            options={LABELS.RETAIL.STATUS}
          />
        )}

        {type === DealType.RETAIL ? null : (
          <FilterPopover
            columnId="dealStatusP"
            label={"Статус проекта"}
            options={LABELS.PROJECT.STATUS}
          />
        )}
      </div>
    </MotionDivY>
  )
}

export default Filters
