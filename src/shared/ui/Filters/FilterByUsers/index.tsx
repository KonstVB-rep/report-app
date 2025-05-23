import { PermissionEnum } from "@prisma/client";
import { ColumnFiltersState } from "@tanstack/react-table";

import React, { memo } from "react";

import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import useStoreUser from "@/entities/user/store/useStoreUser";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";

import FilterPopover from "../FilterPopover";

type Props = {
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: (
    callback: (prev: ColumnFiltersState) => ColumnFiltersState
  ) => void;
  label: string
};

const FilterByUser = ({ columnFilters, setColumnFilters, label }: Props) => {
  const { authUser } = useStoreUser();
  const { deptsFormatted } = useStoreDepartment();

  const currentDepartment = deptsFormatted?.find(
    (dept) => dept.id === authUser?.departmentId
  );

  const usersDepartment = currentDepartment?.users.reduce(
    (acc, user) => ({ ...acc, ...user }),
    {}
  ) as Record<string, string>;

  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}>
      <FilterPopover
        columnId="user"
        options={usersDepartment}
        label={label}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </ProtectedByPermissions>
  );
};

export default memo(FilterByUser);
