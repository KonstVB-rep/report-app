import type { TaskPriority, TaskStatus } from "@prisma/client"

type UserInTask = {
  username: string
  position: string
  email: string
}

export type Task = {
  id: string
  title: string
  description: string
  departmentId: number
  taskStatus: TaskStatus
  taskPriority: TaskPriority
  assignerId: string | null
  executorId: string | null
  orderTask: number
  dueDate: Date
  startDate: Date
  createdAt: Date
  updatedAt: Date
}

export type TaskWithUserInfo = Task & {
  assigner: UserInTask | null
  executor: UserInTask | null
}
