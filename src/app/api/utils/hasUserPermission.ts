// shared/lib/auth/permissions.ts

import type { PermissionEnum } from "@prisma/client"
import { prisma } from "@/prisma/prisma-client"
import type { PayloadType } from "@/shared/lib/auth/session"

export async function hasUserPermission(
  user: PayloadType,
  requiredPermissions: PermissionEnum[] = [],
): Promise<boolean> {
  if (user.role === "ADMIN") return true

  const department = await prisma.department.findUnique({
    where: { id: user.departmentId },
    select: { directorId: true },
  })

  if (department && department.directorId === user.userId) {
    return true
  }

  if (requiredPermissions.length === 0) return false

  return requiredPermissions.some((req) => user.permissions.includes(req))
}
