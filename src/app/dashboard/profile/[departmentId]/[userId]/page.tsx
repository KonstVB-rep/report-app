"use client";

import { PermissionEnum } from "@prisma/client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { DepartmentLabels } from "@/entities/department/types";
import { useGetUser } from "@/entities/user/hooks/query";
import { RolesUser } from "@/entities/user/model/objectTypes";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";
import UserCard from "@/shared/ui/UserCard";

import ProfileDealsData from "./ProfileDealsData";

const PersonEdit = dynamic(() => import("@/entities/user/ui/PersonTableEdit"), {
  ssr: false,
  loading: () => <div className="btn_hover animate-pulse h-10" />,
});
const DeleteUser = dynamic(() => import("@/entities/user/ui/DeleteUser"), {
  ssr: false,
  loading: () => <div className="btn_hover animate-pulse h-10" />,
});

const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

const Loading = dynamic(() => import("./loading"), { ssr: false });

const NotFoundUser = dynamic(() => import("./NotFoundUser"), { ssr: false });

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
            />
            <ProtectedByPermissions
              permissionArr={[PermissionEnum.USER_MANAGEMENT]}
            >
              <div className="grid w-full gap-2 divide-solid rounded-md bg-muted p-4">
                <PersonEdit />
                <DeleteUser />
              </div>
            </ProtectedByPermissions>
          </div>
          <div className="grid h-full w-full gap-2 text-sm">
            <div className="grid gap-2">
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">Отдел:</span>{" "}
                <span className="first-letter:capitalize">
                  {
                    DepartmentLabels[
                      user?.departmentName as keyof typeof DepartmentLabels
                    ]
                  }
                </span>
              </p>
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">Должность:</span>{" "}
                <span className="first-letter:capitalize">
                  {user?.position}
                </span>
              </p>
              <ProtectedByPermissions
                permissionArr={[PermissionEnum.USER_MANAGEMENT]}
              >
                <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                  <span className="first-letter:capitalize">Роль:</span>{" "}
                  <span className="first-letter:capitalize">
                    {RolesUser[user?.role as keyof typeof RolesUser]}
                  </span>
                </p>
              </ProtectedByPermissions>
            </div>
            <div className="grid gap-2">
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">
                  Последняя сессия:
                </span>
                <span>
                  {user?.lastlogin?.toLocaleDateString() || "--/--/--"}
                </span>
              </p>
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">
                  Дата регистрации:
                </span>
                <span>{user?.createdAt?.toLocaleDateString()}</span>
              </p>
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">
                  Дата обновления:
                </span>
                <span>{user?.updatedAt?.toLocaleDateString()}</span>
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
          </div>
        </div>
      </div>

      <ProfileDealsData user={user} />
    </section>
  );
};

export default withAuthGuard(ProfilePage);
