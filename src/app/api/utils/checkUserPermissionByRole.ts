import { PermissionEnum } from "@prisma/client"
import type { PayloadType } from "@/shared/lib/auth/session"
import { hasUserPermission } from "./hasUserPermission"

export const checkUserPermissionByRole = async (
  user: PayloadType,
  permissions?: PermissionEnum[],
) => {
  if (user.permissions.includes(PermissionEnum.READ_ONLY))
    throw new Error("У вас нет доступа к запрашиваемым данным")

  const hasAccess = await hasUserPermission(user, permissions)

  if (!hasAccess) {
    console.error(`Access Denied for user ${user.userId}`)
    throw new Error("У вас нет доступа к запрашиваемым данным")
  }
}
