import { getUser } from "@/entities/user/api";
import ProfileSettings from "@/entities/user/ui/ProfileSettings";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import ProjectsSkeleton from "./ProjectsSkeleton";

const ProjectTableTemplate = ({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  const { userId } = useParams();

  const {
    data: user,
    error,
    isPending: isPendingUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        return await getUser(userId as string);
      } catch (error) {
        console.log(error);
         throw error;
      }
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isPendingUser) return <ProjectsSkeleton />;

  return (
    <section className="p-4 h-full">
      {user ? (
        <div className="grid gap-4" ref={ref}>
          <div className="flex justify-between items-center">
            <ProfileSettings user={user} />
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

export default ProjectTableTemplate;
