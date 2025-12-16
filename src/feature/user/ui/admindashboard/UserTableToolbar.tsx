import { DepartmentLabelsById } from "@/entities/department/lib/constants"
import FilterPopoverGroup from "@/feature/filter-persistence/ui/FilterPopoverGroup"
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput"

interface UserTableToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
}

const UserTableToolbar = ({ globalFilter, onGlobalFilterChange }: UserTableToolbarProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-1">
      <div className="flex items-center justify-start gap-1 flex-wrap">
        <DebouncedInput
          className="p-2 font-lg shadow border border-block"
          onChange={onGlobalFilterChange}
          placeholder="Поиск..."
          value={globalFilter ?? ""}
        />
        <FilterPopoverGroup
          options={[
            {
              label: "Отдел",
              columnId: "departmentId",
              options: DepartmentLabelsById,
            },
          ]}
        />
      </div>
    </div>
  )
}

export default UserTableToolbar
