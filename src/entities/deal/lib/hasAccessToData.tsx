"use client";

import { RolesWithDefaultPermissions } from "@/entities/user/model/objectTypes";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { PermissionType } from "@/entities/user/types";

export const hasAccessToData = (userId: string, permission: PermissionType) => {
  if (!userId) return false;
  const { authUser } = useStoreUser.getState();
  return (
    userId === authUser?.id ||
    RolesWithDefaultPermissions.includes(authUser?.role as string) ||
    authUser?.permissions?.includes(permission)
  );
};
