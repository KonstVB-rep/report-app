"use client";

import React from "react";


import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import { DepartmentLabels } from "@/entities/department/types";
import { RolesUser } from "@/entities/user/model/objectTypes";
import DialogDeleteUser from "@/feature/user/ui/DialogDeleteUser";
import DialogEditUser from "@/feature/user/ui/DialogEditUser";

const EmployeesList = () => {
  const { departments } = useStoreDepartment();
  return (
    <div className="w-fit flex flex-wrap gap-4">
      {departments?.map((dept) => (
        <div key={dept.id} className="bg-muted rounded-md">
          <h3 className="p-4 flex items-center justify-center bg-primary text-secondary rounded-t-md">
            {DepartmentLabels[dept.name as keyof typeof DepartmentLabels]}
          </h3>
          <div className="grid gap-2 p-2 border bg-stone-800 w-full rounded-md">
            {dept.users.map((user) => (
              <div
                key={user.id}
                className={`flex w-full gap-4 items-center justify-between rounded-md border border-solid px-4 py-2 bg-background`}
                title={`${user.username.toUpperCase()} - Перейти в профиль`}
              >
                <div className="grid gap-1 items-center">
                  <p className="capitalize text-start truncate overflow-hidden text-ellipsis whitespace-nowrap w-full">
                    {user.username}
                  </p>
                  {user.position && (
                    <span className="text-xs flex gap-2 first-letter:capitalize text-nowrap text-start">
                      Должность:{" "}
                      <span className="flex gap-2"><span className="first-letter:uppercase">{user.position.split(" ")[0]}</span><span>{user.position.split(" ")[1]}</span></span>
                    </span>
                  )}
                  {user.role && (
                    <p className="text-xs first-letter:capitalize text-nowrap text-start">
                      Роль:{" "}{RolesUser[user?.role as keyof typeof RolesUser]}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <DialogEditUser user={user} />
                  <DialogDeleteUser user={user} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeesList;
