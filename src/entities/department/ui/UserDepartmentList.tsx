"use client";

import { UserResponse } from "@/entities/user/types";
import React from "react";
import UserItem from "./UserItem";
import useStoreDepartment from "../store/useStoreDepartment";
import { useParams } from "next/navigation";

const UserDepartmentList = () => {
  const { departmentId } = useParams();
  const { departments } = useStoreDepartment();

  if (!departmentId || !departments|| typeof departmentId !== "string") {
    return <p>Отдел не найден</p>;
  }

  const currentDepartment = departments.find(
    (dept) => dept.id.toString() === departmentId
  );


  return (
    <>
      <h1 className="text-center text-2xl font-bold p-4">
        {departments ? currentDepartment?.description : "Отдел не найден"}
      </h1>
      {Array.isArray(currentDepartment?.users) && currentDepartment?.users.length > 0 ? (
        <ul className="grid gap-2 pt-4 max-w-max">
          {currentDepartment?.users.map((per: UserResponse) => (
            <UserItem key={per.id} person={per} />
          ))}
        </ul>
      ) : (
        <p>Сотрудники не найдены</p>
      )}
    </>
  );
};

export default UserDepartmentList;
