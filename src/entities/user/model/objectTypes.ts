export const RolesUser = {
  DIRECTOR: "Руководитель",
  EMPLOYEE: "Сотрудник",
  ADMIN: "Администратор",
} as const

export const RolesWithDefaultPermissions = ["ADMIN", "DIRECTOR", "SUPERADMIN"]

export const PermissionUser = {
  VIEW_USER_REPORT: "Просмотр отчета пользователя",
  VIEW_UNION_REPORT: "Просмотр сводных отчетов",
  DOWNLOAD_REPORTS: "Скачивание отчетов",
  USER_MANAGEMENT: "Управление пользователями",
  DEAL_MANAGEMENT: "Редактирование сделок",
  TASK_MANAGEMENT: "Редактирование/удаление задач",
  DEAL_DELETE: "Удаление сделок",
  EQUIPMENT_DELETE: "Удаление оборудования",
  EQUIPMENT_MANAGEMENT: "Редактирование оборудования",
  READ_ONLY: "Только чтение",
} as const
