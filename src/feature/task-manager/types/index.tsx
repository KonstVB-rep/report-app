import { TaskPriority, TaskStatus } from "@prisma/client";

export const LABEL_TASK_STATUS = {
  [TaskStatus.OPEN]: 'Открыта',
  [TaskStatus.IN_PROGRESS]: 'В работе',
  [TaskStatus.DONE]: 'Завершена',
  [TaskStatus.CANCELED]: 'Отменена',
}


export const LABEL_TASK_PRIORITY = {
  [TaskPriority.LOW]: 'Низкий',
  [TaskPriority.MEDIUM]: 'Средний',
  [TaskPriority.HIGH]: 'Высокий',
  [TaskPriority.CRITICAL]: 'Критичный',
}