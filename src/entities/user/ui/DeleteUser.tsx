import DialogDeleteUser from "./DialogDeleteUser";
import { PermissionEnum } from "@prisma/client";
import ProtectedByPermissions from "@/shared/ui/ProtectedByPermissions";

const DeleteUser = () => {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.USER_MANAGEMENT]}>
      <DialogDeleteUser />
    </ProtectedByPermissions>
  );
}

export default DeleteUser;