import { getUser } from "@/entities/user/api";
import { DepartmentsTitle, RolesUser } from "@/entities/user/model/objectTypes";
import { DeleteUser } from "@/entities/user/ui/DeleteUser";
import PersonEdit from "@/entities/user/ui/PersonTableEdit";
import Protected from "@/feature/Protected";
import UserCard from "@/shared/ui/UserCard";
import React from "react";

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;
  const user = await getUser(userId);

  if (!user) {
    return null;
  }

  return (
    <section className="p-4">
      <div className="flex gap-4">
        <div className="flex gap-2 items-center p-2 rounded-md max-w-max border">
          <div>
            <UserCard user={user} />
            <div className="grid grid-cols-2 w-full gap-2 divide-solid p-4 bg-muted rounded-md">
              <PersonEdit />
              <DeleteUser />
            </div>
          </div>
          <div className="grid gap-2 h-full">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
