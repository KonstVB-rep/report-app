"use client";

import DialogEditUser from "@/entities/user/ui/DialogEditUser";
import ProtectedByPermissions from "@/shared/ui/ProtectedByPermissions";

import { PermissionEnum } from "@prisma/client";

const PersonEdit = () => {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.USER_MANAGEMENT]}>
      <DialogEditUser />
    </ProtectedByPermissions>
  );
};

export default PersonEdit;
