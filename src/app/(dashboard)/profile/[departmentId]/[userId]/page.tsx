"use client";

import { PermissionEnum } from "@prisma/client";

import React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { DepartmentLabels } from "@/entities/department/types";
import { useGetUser } from "@/entities/user/hooks/query";
import { RolesUser } from "@/entities/user/model/objectTypes";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";
import ProtectedByPermissions from "@/shared/ui/ProtectedByPermissions";
import UserCard from "@/shared/ui/UserCard";

const PersonEdit = dynamic(() => import("@/entities/user/ui/PersonTableEdit"), {
  ssr: false,
});
const DeleteUser = dynamic(() => import("@/entities/user/ui/DeleteUser"), {
  ssr: false,
});
const AccessDeniedMessage = dynamic(
  () => import("@/shared/ui/AccessDeniedMessage"),
  { ssr: false }
);

const ProfilePage = () => {
  const { userId } = useParams();

  const {
    data: user,
    error,
    isPending,
  } = useGetUser(userId as string, [PermissionEnum.USER_MANAGEMENT]);

  if (isPending)
    return (
      <div className="flex aspect-[16/7] justify-start gap-2 p-4">
        <div className="h-full w-full max-w-[280px] animate-pulse rounded-md bg-muted" />
        <div className="h-full w-full max-w-[220px] animate-pulse rounded-md bg-muted" />
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
        <div className="grid w-full md:max-w-max items-center gap-2 rounded-md border p-2 sm:grid-cols-[auto_1fr]">
          <div className="@container flex h-full min-w-[260px] flex-col justify-between">
            <UserCard
              email={user.email}
              username={user.username}
              phone={user.phone}
              position={user.position}
            />
            <ProtectedByPermissions
              permissionArr={[PermissionEnum.USER_MANAGEMENT]}
            >
              <div className="sm:grid-cols-2 grid w-full gap-2 divide-solid rounded-md bg-muted p-4">
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
                      user.departmentName as keyof typeof DepartmentLabels
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

export default withAuthGuard(ProfilePage);
