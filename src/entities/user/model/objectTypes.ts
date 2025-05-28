export const RolesUser = {
  DIRECTOR: "Руководитель",
  EMPLOYEE: "Сотрудник",
  ADMIN: "Администратор",
} as const;

export const RolesUserMap = {
  DIRECTOR: "DIRECTOR",
  EMPLOYEE: "EMPLOYEE",
  ADMIN: "ADMIN",
} as const;

export const RolesWithDefaultPermissions = ["ADMIN", "DIRECTOR"];

export const PermissionUser = {
  VIEW_USER_REPORT: "Просмотр отчета пользователя",
  VIEW_UNION_REPORT: "Просмотр сводных отчетов",
  DOWNLOAD_REPORTS: "Скачивание отчетов",
  USER_MANAGEMENT: "Управление пользователями",
  DEAL_MANAGEMENT: "Редактирование/удаление сделок",
  TASK_MANAGEMENT: "Редактирование/удаление задач"
} as const;
