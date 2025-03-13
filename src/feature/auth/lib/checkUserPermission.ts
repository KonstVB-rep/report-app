import React from 'react'
import { RolesWithDefaultPermissions } from "@/entities/user/model/objectTypes";
import { User } from "@/entities/user/types";

export const checkUserPermission = (user: User | null) => {

  if (!user || !user.role) {
    return false;
  }

  return RolesWithDefaultPermissions.includes(user.role);
};