"use client";

import DialogEditUser from "@/entities/user/ui/DialogEditUser";
import Protected from "@/feature/Protected";
import { PrismaPermissionsMap } from "../model/objectTypes";

const PersonEdit = () => {
  return (
    <Protected permissionOptional={[PrismaPermissionsMap.USER_MANAGEMENT]}>
      <DialogEditUser />
    </Protected>
  );
};

export default PersonEdit;
