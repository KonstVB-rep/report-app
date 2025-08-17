"use client";

import { PermissionEnum } from "@prisma/client";

import DialogEditUser from "@/entities/user/ui/DialogEditUser";
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions";

const PersonEdit = () => {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.USER_MANAGEMENT]}>
      <DialogEditUser />
    </ProtectedByPermissions>
  );
};

export default PersonEdit;
