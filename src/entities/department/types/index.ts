import type { DepartmentEnum, Task } from "@prisma/client";

import { ReactNode } from "react";

import { UserResponse } from "@/entities/user/types";

export type DepartmentInfo = {
  id: number;
  name: DepartmentEnum;
  directorId: string;
  description: string;
  users: UserResponse[];
};

export type UserShort  = Pick<UserResponse, 'id' | 'departmentId' | "position" | 'username'>

export type UserShortWithTasks = UserShort & { tasks: Task[]}

export type DepartmentWithUsersAndTasks = {
  id: number;
  name: DepartmentEnum;
  directorId: string;
  description: string;
  users: UserShortWithTasks[];
};


export type DepartmentUserItem = {
  id: string;
  departmentId: number;
  username: string;
  position: string;
  url: string;
};

export type DepartmentListItemType = {
  id: number;
  title: string;
  icon?: ReactNode;
  url: string;
  directorId: string;
  items: DepartmentUserItem[];
};

export const DepartmentLabels: Record<keyof typeof DepartmentEnum, string> = {
  SALES: "Отдел продаж",
  TECHNICAL: "Технический отдел",
  MARKETING: "Отдел маркетинга",
} as const;

export type UnionTypeDepartmentsName = keyof typeof DepartmentLabels;
