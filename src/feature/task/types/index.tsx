import type { viewType } from "../model/constants"

const TaskStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  CANCELED: "CANCELED",
}
const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
}

type TaskStatus = keyof typeof TaskStatus

type TaskPriority = keyof typeof TaskPriority

export type TaskFormType = {
  title: string
  departmentId: number
  description: string
  taskStatus: TaskStatus
  taskPriority: TaskPriority
  executorId: string
  dueDate: string
  startDate: string
  orderTask: number
}

export type TaskFormTypeWithId = {
  id: string
  title: string
  departmentId: number
  description: string
  taskStatus: TaskStatus
  taskPriority: TaskPriority
  executorId: string
  dueDate: string
  startDate: string
  orderTask: number
}

export type ViewType = (typeof viewType)[number]["id"]

export type DeleteTaskData = { taskId: string; idTaskOwner: string | null }
