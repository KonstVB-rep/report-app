"use client";
import { getUser } from "@/entities/user/api";
import { DepartmentsTitle, RolesUser } from "@/entities/user/model/objectTypes";
import { DeleteUser } from "@/entities/user/ui/DeleteUser";
import PersonEdit from "@/entities/user/ui/PersonTableEdit";
import { TOAST } from "@/entities/user/ui/Toast";
import Protected from "@/feature/Protected";
import UserCard from "@/shared/ui/UserCard";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

const ProfilePage = () => {
  const { userId } = useParams();

  const { data: user, isPending } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        return await getUser(userId as string);
      } catch (error) {
        console.log(error);
        TOAST.ERROR((error as Error).message);
        return null;
      }
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isPending)
    return (
      <div className="flex gap-2 p-4 justify-start aspect-[16/8] max-w-fit">
        <div className="w-[460px] min-w-[280px] h-full bg-muted animate-pulse rounde-md" />
        <div className="w-[300px] min-w-[200px] h-full bg-muted animate-pulse rounde-md" />
      </div>
    );

  if (!user) {
    return null;
  }

  return (
    <section className="p-4">
      <div className="flex gap-4">
        <div className="flex gap-2 items-center p-2 rounded-md max-w-max border">
          <div className="h-full flex flex-col justify-between">
            <UserCard user={user} />
            <div className="grid grid-cols-2 w-full gap-2 divide-solid p-4 bg-muted rounded-md">
              <PersonEdit />
              <DeleteUser />
            </div>
          </div>
          <div className="grid gap-2 h-full text-sm">
            <div className="grid gap-2">
              <p className="p-2 border border-solid flex items-center justify-start rounded-md gap-4">
                <span className="first-letter:capitalize">Отдел:</span>{" "}
                <span className="first-letter:capitalize">
                  {
                    DepartmentsTitle[
                      user.departmentName as keyof typeof DepartmentsTitle
                    ]
                  }
                </span>
              </p>
              <p className="p-2 border border-solid flex items-center justify-start rounded-md gap-4">
                <span className="first-letter:capitalize">Должность:</span>{" "}
                <span className="first-letter:capitalize">{user.position}</span>
              </p>
              <Protected>
                <p className="p-2 border border-solid flex items-center justify-start rounded-md gap-4">
                  <span className="first-letter:capitalize">Роль:</span>{" "}
                  <span className="first-letter:capitalize">
                    {RolesUser[user.role as keyof typeof RolesUser]}
                  </span>
                </p>
              </Protected>
            </div>
            <div className="grid gap-2">
              <p className="p-2 border border-solid flex items-center justify-start rounded-md gap-4">
                <span className="first-letter:capitalize">
                  Последняя сессия:
                </span>
                <span>
                  {user.lastlogin?.toLocaleDateString() || "--/--/--"}
                </span>
              </p>
              <p className="p-2 border border-solid flex items-center justify-start rounded-md gap-4">
                <span className="first-letter:capitalize">
                  Дата регистрации:
                </span>
                <span>{user.createdAt?.toLocaleDateString()}</span>
              </p>
              <p className="p-2 border border-solid flex items-center justify-start rounded-md gap-4">
                <span className="first-letter:capitalize">
                  Дата обновления:
                </span>
                <span>{user.updatedAt?.toLocaleDateString()}</span>
              </p>
              <p className="p-2 border border-solid flex items-center justify-start rounded-md gap-4">
                <span className="first-letter:capitalize">
                  Тел.:
                </span>
                <span>{user.phone}</span>
              </p>
              <p className="p-2 border border-solid flex items-center justify-start rounded-md gap-4">
                <span className="first-letter:capitalize">
                  Email:
                </span>
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
