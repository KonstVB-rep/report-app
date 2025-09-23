"use client";

import { PermissionEnum, Role } from "@prisma/client";

import { useEffect, useState } from "react";

import { PermissionUser } from "@/entities/user/model/objectTypes";
import { checkPermission, checkRole } from "@/shared/api/checkByServer";

interface ProtectedByRoleProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedByRole = ({
  children,
  role = "ADMIN",
}: ProtectedByRoleProps) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    checkRole(Role.ADMIN).then((result) => {
      if (mounted) setHasAccess(result);
    });

    return () => {
      mounted = false;
    };
  }, [role]);

  if (hasAccess === null) return null;
  if (!hasAccess) return null;

  return <>{children}</>;
};

export default ProtectedByRole;
