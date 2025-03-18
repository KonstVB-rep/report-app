import { PermissionType } from "../types";

export const RolesUser = {
  DIRECTOR: "Руководитель",
  EMPLOYEE: "Сотрудник",
  ADMIN: "Администратор",
} as const


export const RolesUserMap = {
  DIRECTOR: "DIRECTOR",
  EMPLOYEE: "EMPLOYEE",
  ADMIN: "ADMIN",
} as const

export const RolesWithDefaultPermissions = [ "ADMIN", "DIRECTOR"]

export const PermissionUser = {
  VIEW_USER_REPORT: "Просмотр отчета пользователя",
  VIEW_UNION_REPORT: "Просмотр отчета объединения",
  DOWNLOAD_REPORTS: "Скачивание отчетов",
  USER_MANAGEMENT: "Управление пользователями"
} as const;


export const PrismaPermissionsMap: { [key in PermissionType]: PermissionType } = {
  VIEW_USER_REPORT: "VIEW_USER_REPORT",
  VIEW_UNION_REPORT: "VIEW_UNION_REPORT",
  DOWNLOAD_REPORTS: "DOWNLOAD_REPORTS",
  USER_MANAGEMENT: "USER_MANAGEMENT",
};

export const DepartmentsTitle = {
  SALES: "Отдел продаж",
  TECHNICAL: "Технический отдел",
} as const;
