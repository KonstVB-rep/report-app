import type { PayloadType } from "@/shared/lib/auth/session"
import { PERMISSIONS, type PERMISSIONS_UNION } from "@/shared/lib/constants"
import { hasUserPermission } from "./hasUserPermission"

export const checkUserPermissionByRole = async (
  user: PayloadType,
  permissions?: PERMISSIONS_UNION[],
) => {
  if (user.permissions.includes(PERMISSIONS.READ_ONLY))
    throw new Error("У вас нет доступа к запрашиваемым данным")

  const hasAccess = await hasUserPermission(user, permissions)

  if (!hasAccess) {
    console.error(`Access Denied for user ${user.userId}`)
    throw new Error("У вас нет доступа к запрашиваемым данным")
  }
}
