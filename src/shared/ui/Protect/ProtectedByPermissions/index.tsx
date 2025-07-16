"use client";

import { PermissionEnum } from "@prisma/client";

import useStoreUser from "@/entities/user/store/useStoreUser";

type ProtectedProps = {
  permissionArr?: PermissionEnum[];
  children: React.ReactNode;
};

const ProtectedByPermissions = ({ children, permissionArr }: ProtectedProps) => {
  const { hasPermissionByRole, authUser } = useStoreUser();

  if (!authUser) return null;
  if (hasPermissionByRole) return children;
  
  const hasPermissions = permissionArr?.every(p => 
    authUser.permissions?.includes(p)
  );

  return hasPermissions ? children : null;
};

export default ProtectedByPermissions;
