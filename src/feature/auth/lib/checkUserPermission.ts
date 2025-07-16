import { RolesWithDefaultPermissions } from "@/entities/user/model/objectTypes";
import { User } from "@/entities/user/types";

export const checkUserPermission = (user: User | null): boolean => {
  if (!user?.role) {
    return false;
  }

  return RolesWithDefaultPermissions.includes(user.role);
};