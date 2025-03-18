import {  PrismaPermissionsMap } from "@/entities/user/model/objectTypes";
import {  User } from "@/entities/user/types";
import prisma from "@/prisma/prisma-client";

/*получаем текущего/делающего запрос пользователя*/

export async function isUserHasPermissionByRole(
  user: User,
  permission?: (keyof typeof PrismaPermissionsMap)[]
): Promise<boolean> {
  // Получаем информацию о департаменте по ID
  const department = await prisma.department.findUnique({
    where: { id: user.departmentId },
    select: {
      directorId: true, // Получаем только directorId
    },
  });

  const userWithPermissions = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      permissions: {
       include: {
        permission: {
          select: {
            name: true,
          }
        }
       }
      },
    },
  });


  // Если департамент найден и пользователь является директором этого отдела
  if (
    (department && department.directorId === user.id) ||
    user.role === "ADMIN"
  ) {
    return true;
  }

  const hasAllRequiredPermissions = permission?.every(
    (reqPermission: keyof typeof PrismaPermissionsMap) => {
      return userWithPermissions?.permissions.some((p) => {
        console.log(PrismaPermissionsMap[p.permission.name], "p.permission");
        console.log(reqPermission, "reqPermission");

        return PrismaPermissionsMap[p.permission.name] === reqPermission;
      });
    }
  );

  console.log(permission, "hasAllRequiredPermissions");

  if(permission && hasAllRequiredPermissions){
    return true;
  }

  return false;
}
