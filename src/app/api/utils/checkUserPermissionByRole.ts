
import { isUserHasPermissionByRole } from "./isUserHasPermissionByRole";

export const checkUserPermissionByRole = async (userId: string, role: string, departmentId: number) => {

  const hasUserPermission = await isUserHasPermissionByRole(userId, role, departmentId);
  if (!hasUserPermission) {
    console.error("Ошибка прав доступа. Пользователь не имеет разрешения.");
    throw new Error("У вас нет прав для получения запрашиваемых данных");
  }
  return null;
};