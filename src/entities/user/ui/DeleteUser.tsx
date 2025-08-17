import { PermissionEnum } from "@prisma/client";

import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions";

import DialogDeleteUser from "./DialogDeleteUser";

const DeleteUser = () => {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.USER_MANAGEMENT]}>
      <DialogDeleteUser />
    </ProtectedByPermissions>
  );
};

export default DeleteUser;
