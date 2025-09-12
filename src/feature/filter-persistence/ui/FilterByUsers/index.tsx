import { PermissionEnum } from "@prisma/client";

import React, { memo } from "react";

import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions";

import FilterPopover from "../FilterPopover";

type Props = {
  label: string;
  columnId?: string;
  managers: Record<string, string> | { id: string; label: string }[];
};

const FilterByUser = ({ label, columnId = "user", managers }: Props) => {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.VIEW_UNION_REPORT]}>
      <FilterPopover columnId={columnId} options={managers} label={label} />
    </ProtectedByPermissions>
  );
};

export default memo(FilterByUser);
