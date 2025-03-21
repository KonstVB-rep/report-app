"use client";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { PermissionEnum } from "@prisma/client";

type ProtectedProps = {
  permissionOptional?: PermissionEnum[];
  children: React.ReactNode;
};

const Protected = ({ children, permissionOptional }: ProtectedProps) => {
  const { hasPermissionByRole, authUser } = useStoreUser();
  if (!authUser) return null;

  const isExistPermission = () => {
    return (
      permissionOptional &&
      permissionOptional.length > 0 &&
      permissionOptional.every(
        (p: PermissionEnum) =>
          authUser.permissions &&
          authUser.permissions.includes(p as PermissionEnum)
      )
    );
  };

  if (hasPermissionByRole) {
    return children;
  }

  if (isExistPermission()) {
    return children;
  }

  return null;
};

export default Protected;
