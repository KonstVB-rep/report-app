import { PermissionType, User } from "@/entities/user/types";

import { isUserHasPermissionByRole } from "./isUserHasPermissionByRole";

export const checkUserPermissionByRole = async (
  user: User,
  permission?: PermissionType[]
) => {
  const hasUserPermission = await isUserHasPermissionByRole(
    user,
    permission || []
  );

  if (!hasUserPermission) {
    console.error("Ошибка прав доступа. Пользователь не имеет разрешения.");
    throw new Error("У вас нет прав для получения запрашиваемых данных");
  }
  return null;
};
