"use client";

import { PermissionEnum } from "@prisma/client";

import useStoreUser from "@/entities/user/store/useStoreUser";

type ProtectedProps = {
  permissionArr?: PermissionEnum[];
  children: React.ReactNode;
};

const ProtectedByPermissions = ({
  children,
  permissionArr,
}: ProtectedProps) => {
  const { hasPermissionByRole, authUser } = useStoreUser();
  if (!authUser) return null;

  const isExistPermission = () => {
    return (
      permissionArr &&
      permissionArr.length > 0 &&
      permissionArr.every(
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

export default ProtectedByPermissions;
