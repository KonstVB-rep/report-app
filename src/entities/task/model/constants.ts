import { TaskPriority, TaskStatus } from "@prisma/client";

export const LABEL_TASK_STATUS = {
  [TaskStatus.OPEN]: "Открыта",
  [TaskStatus.IN_PROGRESS]: "В работе",
  // [TaskStatus.IN_REVIEW]: 'На проверке',
  [TaskStatus.DONE]: "Завершена",
  [TaskStatus.CANCELED]: "Отменена",
} as const;

export const LABEL_TASK_PRIORITY = {
  [TaskPriority.LOW]: "Низкий",
  [TaskPriority.MEDIUM]: "Средний",
  [TaskPriority.HIGH]: "Высокий",
  [TaskPriority.CRITICAL]: "Срочно",
} as const;

export const TASK_PRIORITY_COLOR_BG = {
  [TaskPriority.LOW]: "bg-blue-600",
  [TaskPriority.MEDIUM]: "bg-orange-400",
  [TaskPriority.HIGH]: "bg-red-500",
  [TaskPriority.CRITICAL]: "bg-red-900",
};

export const TASK_PRIORITY_COLOR_BORDER = {
  [TaskPriority.LOW]: "border-blue-600",
  [TaskPriority.MEDIUM]: "border-orange-400",
  [TaskPriority.HIGH]: "border-red-500",
  [TaskPriority.CRITICAL]: "border-red-900",
};

export const viewType = [
  { id: "table", value: "Таблица" },
  { id: "kanban", value: "Канбан" },
  // { id: "calendar", value: "Календарь" },
] as const;
