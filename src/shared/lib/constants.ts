export const HEIGHT_ROW = 57

export const NOT_GROW_COLS = [
  "rowNumber",
  "select",
  "dateRequest",
  "plannedDateConnection",
  "phone",
  "lastDateConnection",
  "actions",
]

export const SEARCHABLE_COLUMNS = [
  "nameObject",
  "nameDeal",
  "contact",
  "phone",
  "email",
  "comments",
  "inn",
] as const

export const PERMISSIONS = {
  VIEW_USER_REPORT: "VIEW_USER_REPORT",
  VIEW_UNION_REPORT: "VIEW_UNION_REPORT",
  DOWNLOAD_REPORTS: "DOWNLOAD_REPORTS",
  USER_MANAGEMENT: "USER_MANAGEMENT",
  DEAL_MANAGEMENT: "DEAL_MANAGEMENT",
  TASK_MANAGEMENT: "TASK_MANAGEMENT",
  DEAL_DELETE: "DEAL_DELETE",
  EQUIPMENT_DELETE: "EQUIPMENT_DELETE",
  EQUIPMENT_MANAGEMENT: "EQUIPMENT_MANAGEMENT",
  READ_ONLY: "READ_ONLY",
} as const
export type PERMISSIONS_UNION = keyof typeof PERMISSIONS

export const PERMISSIONS_VALUES = Object.values(PERMISSIONS) as [
  PERMISSIONS_UNION,
  ...PERMISSIONS_UNION[],
]
