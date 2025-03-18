

import { PrismaPermissionsMap } from "@/entities/user/model/objectTypes";
import { isUserHasPermissionByRole } from "./isUserHasPermissionByRole";
import { User } from "@/entities/user/types";


export const checkUserPermissionByRole = async (user: User, permission?: (keyof typeof PrismaPermissionsMap)[]) => {

  const hasUserPermission = await isUserHasPermissionByRole(user, permission);
  if (!hasUserPermission) {
    console.error("Ошибка прав доступа. Пользователь не имеет разрешения.");
    throw new Error("У вас нет прав для получения запрашиваемых данных");
  }
  return null;
};