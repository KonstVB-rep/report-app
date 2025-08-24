"use client";

import React from "react";

import useStoreDepartment from "@/entities/department/store/useStoreDepartment";

const EmployeesList = () => {
  const { departments } = useStoreDepartment();
  return (
    <div className="w-fit">
      {departments?.map((dept) => (
        <div key={dept.id}>
          <h3>{dept.name}</h3>
          <div className="grid gap-2 p-2 border bg-stone-800 w-full rounded-md">
            {dept.users.map((user) => (
            <div
              key={user.id}
              className={`flex w-full gap-4 items-center justify-start rounded-md border border-solid px-4 py-2 bg-background`}
              title={`${user.username.toUpperCase()} - Перейти в профиль`}
            >
              <span className="capitalize text-start truncate overflow-hidden text-ellipsis whitespace-nowrap w-full">
                {user.username}
              </span>
              {user.position && (
                <span className="text-xs first-letter:capitalize text-nowrap text-end">
                  {user.position}
                </span>
              )}
            </div>
          ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeesList;
