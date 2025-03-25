"use client";
import { DepartmentsTitle, RolesUser } from "@/entities/user/model/objectTypes";
import { DeleteUser } from "@/entities/user/ui/DeleteUser";
import PersonEdit from "@/entities/user/ui/PersonTableEdit";
import ProtectedByPermissions from "@/shared/ui/ProtectedByPermissions";
import AccessDeniedMessage from "@/shared/ui/AccessDeniedMessage";
import UserCard from "@/shared/ui/UserCard";
import { PermissionEnum } from "@prisma/client";
import { useParams } from "next/navigation";
import React from "react";
import { useGetUser } from "@/entities/user/hooks/query";

const ProfilePage = () => {
  const { userId } = useParams();

  const { data: user, error, isPending } = useGetUser(userId as string, [PermissionEnum.USER_MANAGEMENT]);

  if (isPending)
    return (
      <div className="flex aspect-[16/4] justify-start gap-2 p-4">
        <div className="h-full w-full max-w-[260px] animate-pulse rounded-md bg-muted" />
        <div className="h-full w-full max-w-[360px] animate-pulse rounded-md bg-muted" />
      </div>
    );

  if (error) {
    return <AccessDeniedMessage error={error} />;
  }

  if (!user) {
    return (
      <section className="grid h-full place-items-center p-4">
        <h1 className="rounded-md bg-muted p-5 text-center text-xl font-bold">
          Пользователь не найден
        </h1>
      </section>
    );
  }

  return (
    <section className="p-4">
      <div className="flex gap-4">
        <div className="grid max-w-max items-center gap-2 rounded-md border p-2 sm:grid-cols-[auto_1fr]">
          <div className="@container flex h-full flex-col justify-between">
            <UserCard user={user} />
            <div className="@sm:grid-cols-2 grid w-full gap-2 divide-solid rounded-md bg-muted p-4">
              <PersonEdit />
              <DeleteUser />
            </div>
          </div>
          <div className="grid h-full w-full gap-2 text-sm">
            <div className="grid gap-2">
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">Отдел:</span>{" "}
                <span className="first-letter:capitalize">
                  {
                    DepartmentsTitle[
                      user.departmentName as keyof typeof DepartmentsTitle
                    ]
                  }
                </span>
              </p>
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">Должность:</span>{" "}
                <span className="first-letter:capitalize">{user.position}</span>
              </p>
              <ProtectedByPermissions
                permissionArr={[PermissionEnum.USER_MANAGEMENT]}
              >
                <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                  <span className="first-letter:capitalize">Роль:</span>{" "}
                  <span className="first-letter:capitalize">
                    {RolesUser[user.role as keyof typeof RolesUser]}
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
                  {user.lastlogin?.toLocaleDateString() || "--/--/--"}
                </span>
              </p>
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">
                  Дата регистрации:
                </span>
                <span>{user.createdAt?.toLocaleDateString()}</span>
              </p>
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">
                  Дата обновления:
                </span>
                <span>{user.updatedAt?.toLocaleDateString()}</span>
              </p>
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">Тел.:</span>
                <span>{user.phone}</span>
              </p>
              <p className="flex items-center justify-start gap-4 rounded-md border border-solid p-2">
                <span className="first-letter:capitalize">Email:</span>
                <span>{user.email}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
