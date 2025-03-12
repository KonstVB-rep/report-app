"use client";

import { RolesWithDefaultPermissions } from "@/entities/user/model/objectTypes";
import useStoreUser from "@/entities/user/store/useStoreUser";
import React, { PropsWithChildren } from "react";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { authUser } = useStoreUser();

  return (
    <>
      {authUser?.role && RolesWithDefaultPermissions.includes(authUser.role) ? (
        <>{children}</>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProtectedRoute;
