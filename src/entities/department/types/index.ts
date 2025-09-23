import type { DepartmentEnum } from "@prisma/client";

import { ReactNode } from "react";

import { UserResponse } from "@/entities/user/types";

export type DepartmentInfo = {
  id: number;
  name: DepartmentEnum;
  directorId: string;
  description: string;
  users: UserResponse[];
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

export const DepartmentLabelsById: Record<string, string> = {
  "1": "Отдел продаж",
  "2": "Отдел маркетинга",
  "3": "Технический отдел",
} as const;
export type DepartmentsUnionIds = 1 | 2 | 3;

export type UnionTypeDepartmentsName = keyof typeof DepartmentLabels;
