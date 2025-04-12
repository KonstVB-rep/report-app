import { useParams } from "next/navigation";
import React from "react";
import DealsSkeleton from "./DealsSkeleton";
import { useGetUser } from "@/entities/user/hooks/query";
import { PermissionEnum } from "@prisma/client";
import ErrorMessageTable from "./ErrorMessageTable";

const DealTableTemplate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { userId } = useParams();

  const { data: user, error, isPending } = useGetUser(userId as string, [PermissionEnum.VIEW_USER_REPORT]);

  if (isPending) return <DealsSkeleton />;

  return (
    <section className="h-full p-4">
      {user ? (
        <div className="grid gap-2">
          {children}
        </div>
      ) : (
       <ErrorMessageTable message={error?.message} />
      )}
    </section>
  );
};

export default DealTableTemplate;
