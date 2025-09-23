"use client";

import React from "react";

import { UserResponse } from "@/entities/user/types";
import {
  pageParamsSchemaDepsId,
  useTypedParams,
} from "@/shared/hooks/useTypedParams";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import useStoreDepartment from "../store/useStoreDepartment";
import UserItem from "./UserItem";

const UserDepartmentList = () => {
  const { departmentId } = useTypedParams(pageParamsSchemaDepsId);
  const { departments } = useStoreDepartment();

  if (!departmentId || !departments) {
    return <p>Отдел не найден</p>;
  }

  const currentDepartment = departments.find(
    (dept) => dept.id === departmentId
  );

  if (!currentDepartment) {
    return <p>Отдел не найден</p>;
  }

  return (
    <>
      <h1 className="p-4 text-center text-2xl font-bold">
        {departments ? currentDepartment?.description : "Отдел не найден"}
      </h1>
      {Array.isArray(currentDepartment?.users) &&
      currentDepartment?.users.length > 0 ? (
        <ul className="grid w-full sm:max-w-fit gap-2 pt-4">
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
