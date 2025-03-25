import { useParams } from "next/navigation";
import React from "react";
import DealsSkeleton from "./DealsSkeleton";
import { useGetUser } from "@/entities/user/hooks/query";
import { PermissionEnum } from "@prisma/client";

const DealTableTemplate = ({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  const { userId } = useParams();

  const { data: user, error, isPending } = useGetUser(userId as string, [PermissionEnum.VIEW_USER_REPORT]);

  if (isPending) return <DealsSkeleton />;

  return (
    <section className="h-full p-4">
      {user ? (
        <div className="grid gap-2" ref={ref}>
          {children}
        </div>
      ) : (
        <div className="grid h-full place-items-center">
          <h1 className="rounded-md bg-muted p-4 text-center text-xl">
            {error?.message}
          </h1>
        </div>
      )}
    </section>
  );
};

export default DealTableTemplate;
