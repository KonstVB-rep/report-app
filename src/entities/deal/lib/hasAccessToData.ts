"use client";

import { RolesWithDefaultPermissions } from "@/entities/user/model/objectTypes";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { PermissionType } from "@/entities/user/types";

const hasDefaultRole = (role?: string) =>
  role ? RolesWithDefaultPermissions.includes(role) : false;

const hasPermission = (permissions: PermissionType[] | undefined, permission: PermissionType) =>
  permissions ? permissions.includes(permission) : false;

export const hasAccessToData = (userId: string, permission: PermissionType): boolean => {
  if (!userId) return false;

  const { authUser } = useStoreUser.getState();

  if (!authUser) return false;

  if (userId === authUser.id) return true;

  if (hasDefaultRole(authUser.role)) return true;

  if (hasPermission(authUser.permissions, permission)) return true;

  return false;
};

export const hasAccessToDataSummary = (
  userId: string,
  permission: PermissionType
): boolean => {
  if (!userId) return false;

  const { authUser } = useStoreUser.getState();

  if (!authUser) return false;

  if (hasDefaultRole(authUser.role)) return true;

  if (hasPermission(authUser.permissions, permission)) return true;

  return false;
};
