"use client";

import { UserResponse } from "@/entities/user/types";
import React from "react";
import UserItem from "./UserItem";
import useStoreDepartment from "../store/useStoreDepartment";
import { useParams } from "next/navigation";
import withAuthGuard from "@/widgets/Files/libs/hoc/withAuthGuard";

const UserDepartmentList = () => {

  const { departmentId } = useParams();
  const { departments } = useStoreDepartment();

  if (!departmentId || !departments || typeof departmentId !== "string") {
    return <p>Отдел не найден</p>;
  }

  const currentDepartment = departments.find(
    (dept) => dept.id.toString() === departmentId
  );

  return (
    <>
      <h1 className="p-4 text-center text-2xl font-bold">
        {departments ? currentDepartment?.description : "Отдел не найден"}
      </h1>
      {Array.isArray(currentDepartment?.users) &&
      currentDepartment?.users.length > 0 ? (
        <ul className="grid max-w-max gap-2 pt-4">
          {currentDepartment?.users.map((per: UserResponse) => (
            <UserItem key={per.id} {...per} />
          ))}
        </ul>
      ) : (
        <p>Сотрудники не найдены</p>
      )}
    </>
  );
};

export default withAuthGuard(UserDepartmentList);
