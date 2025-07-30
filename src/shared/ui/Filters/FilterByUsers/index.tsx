import { PermissionEnum } from "@prisma/client";

import React, { memo } from "react";

import { getManagers } from "@/entities/department/lib/utils";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";

import FilterPopover from "../FilterPopover";

type Props = {
  label: string;
  columnId?: string;
};

const managers = getManagers();

const FilterByUser = ({ label, columnId = "user" }: Props) => {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}>
      <FilterPopover columnId={columnId} options={managers} label={label} />
    </ProtectedByPermissions>
  );
};

export default memo(FilterByUser);
