import type { DepartmentEnum } from "@prisma/client"

export const NOT_MANAGERS_POSITIONS = {
  DEVELOPER: "разработчик",
  ASSISTANT_MANAGER: "помощник руководителя",
  MARKETING_SPECIALIST: "маркетолог",
}

export const NOT_MANAGERS_POSITIONS_KEYS = Object.keys(NOT_MANAGERS_POSITIONS)
export const NOT_MANAGERS_POSITIONS_VALUES = Object.values(NOT_MANAGERS_POSITIONS)

export const DepartmentLabels: Record<keyof typeof DepartmentEnum, string> = {
  SALES: "Отдел продаж",
  TECHNICAL: "Технический отдел",
  MARKETING: "Отдел маркетинга",
} as const

export const DepartmentLabelsById: Record<string, string> = {
  "1": "Отдел продаж",
  "2": "Отдел маркетинга",
  "3": "Технический отдел",
} as const
