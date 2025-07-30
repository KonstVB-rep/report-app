import { DepartmentEnum, Task, TaskPriority, TaskStatus } from "@prisma/client";

import { UserResponse } from "@/entities/user/types";

import { viewType } from "../model/constants";

export type TaskFormType = {
  title: string;
  departmentId: string;
  description: string;
  taskStatus: TaskStatus;
  taskPriority: TaskPriority;
  executorId: string;
  dueDate: string;
  startDate: string;
  orderTask: number;
};

export type TaskFormTypeWithId = {
  id: string;
  title: string;
  departmentId: number;
  description: string;
  taskStatus: TaskStatus;
  taskPriority: TaskPriority;
  executorId: string;
  dueDate: string;
  startDate: string;
  orderTask: number;
};

export type UserShort = Pick<
  UserResponse,
  "id" | "departmentId" | "position" | "username"
>;

export type UserShortWithTasks = UserShort & { tasksExecuted: Task[] };

export type DepartmentWithUsersAndTasks = {
  id: number;
  name: DepartmentEnum;
  directorId: string;
  description: string;
  users: UserShortWithTasks[];
};

type UserInTask = {
  username: string;
  position: string;
  email: string;
};

export type TaskWithUserInfo = {
  id: string;
  title: string;
  description: string;
  taskStatus: TaskStatus;
  taskPriority: TaskPriority;
  assignerId: string;
  executorId: string;
  orderTask: number;
  departmentId: number;
  dueDate: Date;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;

  assigner: UserInTask;
  executor: UserInTask;
};

export type ViewType = (typeof viewType)[number]["id"];

export type CreateTaskReturn = { error: boolean; message: string; data: null };

export type DeleteTaskData = { taskId: string; idTaskOwner: string };
