"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { DepartmentLabels } from "@/entities/department/types";
import { useGetUser } from "@/feature/user/hooks/query";
import UserCard from "@/shared/custom-components/ui/UserCard";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import ProfileDealsData from "./ui/ProfileDealsData";

const AccessDeniedMessage = dynamic(
  () => import("@/shared/custom-components/ui/AccessDeniedMessage"),
  { ssr: false }
);

const Loading = dynamic(() => import("./loading"), { ssr: false });

const NotFoundUser = dynamic(() => import("./ui/NotFoundUser"), { ssr: false });

const ProfilePage = () => {
  const { userId } = useParams();

  const { data: user, error, isPending } = useGetUser(userId as string);

  if (isPending) return <Loading />;

  if (error) {
    return <AccessDeniedMessage error={error} />;
  }

  if (!user) {
    return <NotFoundUser />;
  }

  return (
    <section className="p-4 flex gap-2 flex-wrap">
      <div className="flex gap-4">
        <div className="grid w-full md:max-w-max items-center gap-2 rounded-md border p-2 sm:grid-cols-[auto_1fr]">
          <div className="@container flex h-full min-w-[260px] flex-col justify-between">
            <UserCard
              email={user?.email}
              username={user?.username}
              phone={user?.phone}
              position={user?.position}
              departmentName={
                DepartmentLabels[
                  user?.departmentName as keyof typeof DepartmentLabels
                ]
              }
            />
          </div>

          <div className="grid gap-2 h-full">
            <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
              <span className="first-letter:capitalize">Последняя сессия:</span>
              <span>{user?.lastlogin?.toLocaleDateString() || "--/--/--"}</span>
            </p>

            <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
              <span className="first-letter:capitalize">Дата регистрации:</span>
              <span>{user?.createdAt?.toLocaleDateString()}</span>
            </p>

            <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
              <span className="first-letter:capitalize">Тел.:</span>
              <span>{user?.phone}</span>
            </p>
            <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
              <span className="first-letter:capitalize">Email:</span>

              <span>{user?.email}</span>
            </p>
          </div>
          {/* </div> */}
        </div>
      </div>

      <ProfileDealsData user={user} />
    </section>
  );
};

export default withAuthGuard(ProfilePage);
