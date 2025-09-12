import { DepartmentLabelsById } from "@/entities/department/types";
import FilterPopoverGroup from "@/feature/filter-persistence/ui/FilterPopoverGroup";
import DebouncedInput from "@/shared/custom-components/ui/DebouncedInput";
import DialogAddUser from "../DialogAddUser";

interface UserTableToolbarProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
}

const UserTableToolbar = ({ 
  globalFilter, 
  onGlobalFilterChange 
}: UserTableToolbarProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-1">
      <div className="flex items-center justify-start gap-1 flex-wrap">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={onGlobalFilterChange}
          className="p-2 font-lg shadow border border-block"
          placeholder="Поиск..."
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
      <DialogAddUser className="text-sm justify-start w-fit" />
    </div>
  );
};

export default UserTableToolbar;