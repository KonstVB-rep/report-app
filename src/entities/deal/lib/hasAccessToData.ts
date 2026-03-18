"use client"

import { RolesWithDefaultPermissions } from "@/entities/user/model/objectTypes"
import useStoreUser, { type AuthUserType } from "@/entities/user/store/useStoreUser"
import type { PermissionType } from "@/entities/user/types"

const hasDefaultRole = (role?: string) =>
  role ? RolesWithDefaultPermissions.includes(role) : false

const hasPermission = (permissions: PermissionType[] | undefined, permission: PermissionType) =>
  permissions ? permissions.includes(permission) : false

export const hasAccessToData = (pageUserId: string, permission: PermissionType): boolean => {
  if (!pageUserId) return false

  const { authUser } = useStoreUser.getState()

  if (!authUser) return false

  if (pageUserId === authUser.id) return true

  if (hasDefaultRole(authUser.role)) return true

  if (hasPermission(authUser.permissions, permission)) return true

  return false
}

export const hasAccessToDataPage = (
  authUser: AuthUserType | null,
  pageUserId: string,
  permission: PermissionType,
): boolean => {
  if (!authUser) return false
  if (pageUserId === authUser.id) return true
  if (hasDefaultRole(authUser.role)) return true
  if (hasPermission(authUser.permissions, permission)) return true
  return false
}

export const hasAccessToDataSummary = (userId: string, permission: PermissionType): boolean => {
  if (!userId) return false

  const { authUser } = useStoreUser.getState()

  if (!authUser) return false

  if (hasDefaultRole(authUser.role)) return true

  if (hasPermission(authUser.permissions, permission)) return true

  return false
}
