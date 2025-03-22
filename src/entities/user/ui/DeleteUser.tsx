import DialogDeleteUser from "./DialogDeleteUser";
import { PermissionEnum } from "@prisma/client";
import ProtectedByPermissions from "@/shared/ui/ProtectedByPermissions";

export function DeleteUser() {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.USER_MANAGEMENT]}>
      <DialogDeleteUser />
    </ProtectedByPermissions>
  );
}
