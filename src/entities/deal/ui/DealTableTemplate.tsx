import { PermissionEnum } from "@prisma/client";

import React from "react";

import { useParams } from "next/navigation";

import { useGetUser } from "@/entities/user/hooks/query";
import useStoreUser from "@/entities/user/store/useStoreUser";

import DealsSkeleton from "./DealsSkeleton";
import ErrorMessageTable from "./ErrorMessageTable";

type DealTableTemplateProps = {
  children: React.ReactNode;
};

const DealTableTemplate = ({ children }: DealTableTemplateProps) => {
  const { userId } = useParams();
  const { authUser } = useStoreUser();

  const currentUserId = userId ?? authUser?.id;

  const {
    data: user,
    error,
    isPending,
  } = useGetUser(currentUserId as string, [PermissionEnum.VIEW_USER_REPORT]);

  if (isPending) return <DealsSkeleton />;

  if (!user) {
    return (
      <ErrorMessageTable message={error?.message || "Пользователь не найден"} />
    );
  }

  return (
    <section className="h-full p-4 grid gap-2 content-start">
      {children}
    </section>
  );
};

export default DealTableTemplate;
