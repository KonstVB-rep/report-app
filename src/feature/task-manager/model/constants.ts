import { TaskPriority, TaskStatus } from "@prisma/client";

export const LABEL_TASK_STATUS = {
  [TaskStatus.OPEN]: 'Открыта',
  [TaskStatus.IN_PROGRESS]: 'В работе',
  // [TaskStatus.IN_REVIEW]: 'На проверке',
  [TaskStatus.DONE]: 'Завершена',
  [TaskStatus.CANCELED]: 'Отменена',
} as const;


export const LABEL_TASK_PRIORITY = {
  [TaskPriority.LOW]: 'Низкий',
  [TaskPriority.MEDIUM]: 'Средний',
  [TaskPriority.HIGH]: 'Высокий',
  [TaskPriority.CRITICAL]: 'Срочно',
} as const

export const TASK_PRIORITY_COLOR_BG = {
  [TaskPriority.LOW]: 'bg-blue-600',
  [TaskPriority.MEDIUM]: 'bg-yellow-400',
  [TaskPriority.HIGH]: 'bg-orange-600',
  [TaskPriority.CRITICAL]: 'bg-red-600',
}

export const TASK_PRIORITY_COLOR_BORDER = {
  [TaskPriority.LOW]: 'border-blue-600',
  [TaskPriority.MEDIUM]: 'border-yellow-400',
  [TaskPriority.HIGH]: 'border-orange-600',
  [TaskPriority.CRITICAL]: 'border-red-600',
}