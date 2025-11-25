import { DepartmentLabelsById } from "@/entities/department/lib/constants"
import type { UserTypeTable } from "@/entities/user/model/column-data-user"
import FilterPopoverGroup from "@/feature/filter-persistence/ui/FilterPopoverGroup"
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput"
import UserActionsBlock from "./UserActionsBlock"

interface UserTableToolbarProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  rowSelection: UserTypeTable[]
}

const UserTableToolbar = ({
  globalFilter,
  onGlobalFilterChange,
  rowSelection,
}: UserTableToolbarProps) => {
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
      <UserActionsBlock rowSelection={rowSelection} />
    </div>
  )
}

export default UserTableToolbar
