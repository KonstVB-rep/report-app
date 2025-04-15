import { PermissionEnum } from "@prisma/client";

import { User } from "@/entities/user/types";
import prisma from "@/prisma/prisma-client";

export async function isUserHasPermissionByRole(
  user: User,
  permission?: (keyof typeof PermissionEnum)[]
): Promise<boolean> {
  if (!user) return false;

  // Получаем информацию о департаменте по ID
  const department = await prisma.department.findUnique({
    where: { id: user.departmentId },
    select: { directorId: true },
  });

  // Получаем разрешения пользователя
  const userWithPermissions = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      role: true, // Добавляем роль, если она не в объекте user
      permissions: {
        include: {
          permission: {
            select: { name: true },
          },
        },
      },
    },
  });

  // Если департамент найден и пользователь — директор этого отдела или он администратор
  if (
    (department && department.directorId === user.id) ||
    userWithPermissions?.role === "ADMIN"
  ) {
    return true;
  }

  // Если у пользователя нет разрешений в базе, сразу возвращаем false
  if (!userWithPermissions?.permissions?.length) {
    console.log("Пользователь не имеет никаких разрешений.");
    return false;
  }

  const permissionsUser = userWithPermissions.permissions.map(
    (p) => p.permission.name
  );

  if (!permission || permission.length === 0) {
    return false;
  }

  const hasAllRequiredPermissions = permission.some((reqPermission) => {
    const hasPermission = permissionsUser.includes(reqPermission);
    return hasPermission;
  });

  return hasAllRequiredPermissions;
}
