import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import useStoreUser from "@/entities/user/store/useStoreUser";
import React from "react";
import FilterPopover from "../FilterPopover";
import { ColumnFiltersState } from "@tanstack/react-table";
import ProtectedByPermissions from "@/shared/ui/ProtectedByPermissions";
import { PermissionEnum } from "@prisma/client";
import { useParams, usePathname } from "next/navigation";

type Props = {
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: (
    callback: (prev: ColumnFiltersState) => ColumnFiltersState
  ) => void;
};

const FilterByUser = ({ columnFilters, setColumnFilters }: Props) => {
  const { authUser } = useStoreUser();
  const { deptsFormatted } = useStoreDepartment();
  const pathname = usePathname();
  const { dealType } = useParams();

  const hasTable = pathname.includes(
    `/summary-table/${authUser?.departmentId}/${dealType}/${authUser?.id}`
  );

  const currentDepartment = deptsFormatted?.find(
    (dept) => dept.id === authUser?.departmentId
  );

  const usersDepartment = currentDepartment?.users.reduce(
    (acc, user) => ({ ...acc, ...user }),
    {}
  ) as Record<string, string>;

  if (!hasTable) return null;

  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}>
      <FilterPopover
        columnId="user"
        options={usersDepartment}
        label="Менеджер"
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </ProtectedByPermissions>
  );
};

export default FilterByUser;
