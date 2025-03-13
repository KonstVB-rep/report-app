"use client";

import useStoreUser from "@/entities/user/store/useStoreUser";
import React, { PropsWithChildren } from "react";

const Protected = ({ children }: PropsWithChildren) => {
  const { hasPermission } = useStoreUser();

  return <>{hasPermission ? <>{children}</> : <></>}</>;
};

export default Protected;
