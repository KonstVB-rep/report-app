import { TaskPriority, TaskStatus } from "@prisma/client";

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
