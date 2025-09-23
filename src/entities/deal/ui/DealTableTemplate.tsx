import { PermissionEnum } from "@prisma/client";

import React from "react";

import z from "zod";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { useGetUser } from "@/feature/user/hooks/query";
import { useTypedParams } from "@/shared/hooks/useTypedParams";

import DealsSkeleton from "./DealsSkeleton";
import ErrorMessageTable from "./ErrorMessageTable";

type DealTableTemplateProps = {
  children: React.ReactNode;
};

const pageParamsSchema = z.object({
  userId: z.string(),
});

const DealTableTemplate = ({ children }: DealTableTemplateProps) => {
  const { userId } = useTypedParams(pageParamsSchema);
  const { authUser } = useStoreUser();

  const currentUserId = userId ?? authUser?.id;

  const {
    data: user,
    error,
    isPending,
  } = useGetUser(currentUserId, [PermissionEnum.VIEW_USER_REPORT]);

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
