import { User } from "@/entities/user/types";
import React from "react";
import UserItem from "./UserItem";

type Props = {
  persons: User[] | null;
};

const UserDepartmentList = ({ persons }: Props) => {
  return (
    <>
      {Array.isArray(persons) && persons.length > 0 ? (
        <ul className="grid gap-2 pt-4 max-w-max">
          {persons.map((per) => (
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
