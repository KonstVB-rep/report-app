"use client";

import useStoreUser from "@/entities/user/store/useStoreUser";

import useStoreDepartment, { DeptFormatted } from "../store/useStoreDepartment";
import { NOT_MANAGERS_POSITIONS } from "./constants";

type Dept = {
  id: number;
  name: string;
  description: string;
  users: {
    id: string;
    username: string;
  }[];
};

export const formattedArr = <T extends Dept>(
  arr: T[] | null
): DeptFormatted[] | null => {
  if (!arr || arr.length === 0) return null;

  return arr.map((dept) => ({
    id: dept.id,
    name: dept.name,
    description: dept.description,
    users: dept.users.map((user) => {
      return { [user.id]: user.username };
    }),
  }));
};

export const getManagers = (onlyManagers = true) => {
  const { authUser } = useStoreUser.getState();
  const { departments } = useStoreDepartment.getState();

  const currentDepartment = departments?.find(
    (dept) => dept.id === authUser?.departmentId
  );
  if (onlyManagers) {
    return (
      currentDepartment?.users.reduce(
        (acc, item) => {
          if (
            !(Object.values(NOT_MANAGERS_POSITIONS) as string[]).includes(
              item.position
            )
          ) {
            acc[item.id] = item.username;
          }
          return acc;
        },
        {} as Record<string, string>
      ) ?? {}
    );
  } else {
    return (
      currentDepartment?.users.reduce(
        (acc, item) => {
          acc[item.id] = item.username;
          return acc;
        },
        {} as Record<string, string>
      ) ?? {}
    );
  }
};
