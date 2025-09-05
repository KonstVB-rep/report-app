"use client";

import React from "react";

import { CircleUserRound } from "lucide-react";

import useStoreDepartment from "@/entities/department/store/useStoreDepartment";
import { DepartmentLabels } from "@/entities/department/types";
import { RolesUser } from "@/entities/user/model/objectTypes";
import { UserOmit } from "@/entities/user/types";
import DialogAddUser from "@/feature/user/ui/DialogAddUser";
import DialogDeleteUser from "@/feature/user/ui/DialogDeleteUser";
import DialogEditUser from "@/feature/user/ui/DialogEditUser";

import { PopoverMenuComponent } from "./DropDowmMenu";

const actionItems = (
  data: UserOmit
): { label: string; item: React.ReactNode }[] => [
  {
    label: "Редактировать",
    item: <DialogEditUser user={data} textButtonShow={true} />,
  },
  {
    label: "Удалить",
    item: <DialogDeleteUser user={data} textButtonShow={true} />,
  },
];

const EmployeesList = () => {
  const { departments } = useStoreDepartment();

  return (
    <div className="grid gap-4">
      <DialogAddUser className="text-sm justify-start w-fit" />
      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))] gap-4">
        {departments?.map((dept) => (
          <div
            key={dept.id}
            className="relative bg-muted rounded-md"
          >
            <h3 className="sticky t-0 w-full p-4 flex items-center justify-center bg-primary text-secondary rounded-t-md">
              {DepartmentLabels[dept.name as keyof typeof DepartmentLabels]}
            </h3>
            <div  className="grid gap-2 p-2 border bg-stone-800 w-full rounded-md overflow-auto max-h-[78vh]">
              {dept.users.map((user) => (
                <div
                  key={user.id}
                  className={`flex w-full flex-wrap gap-4 items-center justify-between rounded-md border border-solid px-4 py-2 bg-background`}
                >
                  <div className="flex gap-2 items-center">
                    <CircleUserRound
                      size={50}
                      strokeWidth={1}
                      absoluteStrokeWidth
                    />
                    <div className="grid gap-1 items-center">
                      <p className="capitalize text-start truncate overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {user.username}
                      </p>
                      {user.position && (
                        <span className="text-xs flex flex-wrap gap-2 first-letter:capitalize text-nowrap text-start">
                          Должность:{" "}
                          <span className="flex gap-2">
                            <span className="first-letter:uppercase">
                              {user.position.split(" ")[0]}
                            </span>
                            <span>{user.position.split(" ")[1]}</span>
                          </span>
                        </span>
                      )}
                      {user.role && (
                        <p className="text-xs flex flex-wrap gap-2 first-letter:capitalize text-nowrap text-start">
                          Роль:{" "}
                          {RolesUser[user?.role as keyof typeof RolesUser]}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <PopoverMenuComponent items={actionItems(user)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesList;
