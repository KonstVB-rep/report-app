import ProfileSettings from "@/entities/user/ui/ProfileSettings";
import { useParams } from "next/navigation";
import React from "react";
import DealsSkeleton from "./DealsSkeleton";
import LinkToUserTable from "./LinkToUserTable";
import { useGetUser } from "@/entities/user/hooks";

const DealTableTemplate = ({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  const { userId } = useParams();

  const { data: user, error, isPending } = useGetUser(userId as string);

  if (isPending) return <DealsSkeleton />;

  return (
    <section className="p-4 h-full">
      {user ? (
        <div className="grid gap-2" ref={ref}>
          <div className="flex justify-between items-center">
            <ProfileSettings user={user} />
            <LinkToUserTable />
          </div>
          {children}
        </div>
      ) : (
        <div className="grid place-items-center h-full">
          <h1 className="text-xl text-center p-4 bg-muted rounded-md">
            {error?.message}
          </h1>
        </div>
      )}
    </section>
  );
};

export default DealTableTemplate;
