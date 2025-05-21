import { PermissionEnum } from "@prisma/client";
import { ColumnFiltersState } from "@tanstack/react-table";

import React, { memo } from "react";

import { useParams, usePathname } from "next/navigation";

import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import useStoreUser from "@/entities/user/store/useStoreUser";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";

import FilterPopover from "../FilterPopover";

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

export default memo(FilterByUser);
