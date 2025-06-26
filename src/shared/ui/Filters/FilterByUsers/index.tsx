import { PermissionEnum } from "@prisma/client";
import { ColumnFiltersState } from "@tanstack/react-table";

import React, { memo } from "react";

import { getManagers } from "@/entities/department/lib/utils";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";

import FilterPopover from "../FilterPopover";

type Props = {
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: (
    callback: (prev: ColumnFiltersState) => ColumnFiltersState
  ) => void;
  label: string;
  columnId?: string;
};

const managers = getManagers();

const FilterByUser = ({
  columnFilters,
  setColumnFilters,
  label,
  columnId = "user",
}: Props) => {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}>
      <FilterPopover
        columnId={columnId}
        options={managers}
        label={label}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </ProtectedByPermissions>
  );
};

export default memo(FilterByUser);
