import { Role } from "@prisma/client";

import React, { PropsWithChildren } from "react";

import { useParams } from "next/navigation";

import useStoreUser from "@/entities/user/store/useStoreUser";

const ProtectedByDepartmentAffiliation = ({ children }: PropsWithChildren) => {
  const { authUser } = useStoreUser();
  const { departmentId } = useParams();

  if (!authUser) return null;

  if (
    authUser.departmentId !== Number(departmentId) ||
    authUser.role !== Role.ADMIN
  )
    return null;

  return <>{children}</>;
};

export default ProtectedByDepartmentAffiliation;
