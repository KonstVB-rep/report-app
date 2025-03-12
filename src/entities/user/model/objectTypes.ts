export const RolesUser = {
  DIRECTOR: "Руководитель",
  EMPLOYEE: "Сотрудник",
  ADMIN: "Администратор",
} as const

export const RolesWithDefaultPermissions = [ "ADMIN", "DIRECTOR"]

export const PermissionsUser = {
  VIEW_REPORTS: "Просмотр отчетов других менеджеров",
  EDIT_PROJECTS: "Редактирование проектов",
  DELETE_PROJECTS: "Удаление проектов",
  DOWNLOAD_REPORTS: "Скачать отчет",
  CREATE_USER: "Создание пользователя",
  DELETE_USER: "Удаление пользователя",
  EDIT_USER: "Редактирование пользователя",
} as const;

export const DepartmentsTitle = {
  SALES: "Отдел продаж",
  TECHNICAL: "Технический отдел",
} as const;
