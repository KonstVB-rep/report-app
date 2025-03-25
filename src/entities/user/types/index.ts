import { PermissionEnum } from "@prisma/client";
import { PermissionUser, RolesUser } from "../model/objectTypes";

export type RoleType = keyof typeof RolesUser;
export type DepartmentTypeName = "SALES" | "TECNICAL";
export type User = {
  id: string;
  username: string;
  phone: string;
  user_password: string;
  email: string;
  position: string;
  departmentId: number;
  role: RoleType;
  lastlogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  permissions?: PermissionType[];
};

export type UserWithdepartmentName = Omit<
  User,
  "user_password" | "lastlogin" | "createdAt" | "updatedAt"
> & {
  departmentName: DepartmentTypeName;
};

export type UserRequest = Omit<
  User,
  "id" | "lastlogin" | "createdAt" | "updatedAt" | "departmentId"
> & {
  department: DepartmentTypeName;
  permissions: PermissionType[];
};
export type UserResponse = Omit<
  User,
  "lastlogin" | "createdAt" | "updatedAt" | "user_password"
>;

export enum Permission {
  VIEW_USER_REPORT = "Просмотр отчета пользователя",
  VIEW_UNION_REPORT = "Просмотр отчета объединения",
  DOWNLOAD_REPORTS = "Скачивание отчетов",
  USER_MANAGEMENT = "Управление пользователями",
}

export type Option = {
  label: string;
  value: string;
  disable?: boolean;
};

export const OPTIONS: Option[] = [
  {
    label: PermissionUser.VIEW_USER_REPORT,
    value: PermissionEnum.VIEW_USER_REPORT,
  },
  {
    label: PermissionUser.VIEW_UNION_REPORT,
    value: PermissionEnum.VIEW_UNION_REPORT,
  },
  {
    label: PermissionUser.DOWNLOAD_REPORTS,
    value: PermissionEnum.DOWNLOAD_REPORTS,
  },
  {
    label: PermissionUser.USER_MANAGEMENT,
    value: PermissionEnum.USER_MANAGEMENT,
  },
];

export type PermissionType = keyof typeof Permission;
