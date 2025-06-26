import { PermissionEnum } from "@prisma/client";

import React from "react";

import { useParams } from "next/navigation";

import { useGetUser } from "@/entities/user/hooks/query";
import useStoreUser from "@/entities/user/store/useStoreUser";

import DealsSkeleton from "./DealsSkeleton";
import ErrorMessageTable from "./ErrorMessageTable";

const DealTableTemplate = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useParams();

  const { authUser } = useStoreUser();

  const id = userId ?? authUser?.id;

  const {
    data: user,
    error,
    isPending,
  } = useGetUser(id as string, [PermissionEnum.VIEW_USER_REPORT]);

  if (isPending) return <DealsSkeleton />;

  return (
    <section className="h-full p-4">
      {user ? (
        <div className="grid gap-2">{children}</div>
      ) : (
        <ErrorMessageTable message={error?.message} />
      )}
    </section>
  );
};

export default DealTableTemplate;
