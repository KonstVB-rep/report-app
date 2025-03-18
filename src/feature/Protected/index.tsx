"use client";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { PermissionType } from "@/entities/user/types";

type ProtectedProps = {
  permissionOptional?: PermissionType[];
  children: React.ReactNode;
};

const Protected = ({ children, permissionOptional }: ProtectedProps) => {
  const { hasPermission, authUser } = useStoreUser();
  if (!authUser) return null;

  const isExistPermission = () => {
    return (
      permissionOptional &&
      permissionOptional.length > 0 &&
      permissionOptional.every(
        (p: PermissionType) =>
          authUser.permissions &&
          authUser.permissions.includes(p as PermissionType)
      )
    );
  };

  if (hasPermission) {
    return children;
  }

console.log(authUser,isExistPermission(), 'ghhhhhhhhhhhhhhhhhhh')

  if (isExistPermission()) {
    return true;
  }

  return null;
};

export default Protected;
