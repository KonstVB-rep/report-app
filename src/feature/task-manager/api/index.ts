"use server";

import {
  PermissionEnum,
  // Prisma,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";

import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole";
import { handleAuthorization } from "@/app/api/utils/handleAuthorization";
import prisma from "@/prisma/prisma-client";
import { handleError } from "@/shared/api/handleError";
// import { TOAST } from "@/shared/ui/Toast";

import { TaskFormType, TaskFormTypeWithId, TaskWithUserInfo } from "../types";
// import { getDepartmentUsersWithTasks } from "./queryFn";

export const getTasksDepartment = async (departmentId: number): Promise<TaskWithUserInfo[] | []> => {
  try {
    await handleAuthorization();

    // if(user!.departmentId !== +departmentId){
    //   return checkUserPermissionByRole(user!, [PermissionEnum.VIEW_USER_REPORT] )
    // }

    return await prisma.task.findMany({
      where: {
        departmentId, // укажи нужный ID департамента
      },
      include: {
        assigner: {
          select: {
            username: true,
            email: true,
            position: true,
          },
        },
        executor: {
          select: {
            username: true,
            email: true,
            position: true,
          },
        },
      },
      orderBy: [{taskStatus: 'asc'}, {orderTask:"asc"}]
    });
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};


export const getUserTasks = async (userId: string): Promise<TaskWithUserInfo[] | []> => {
  try {
    await handleAuthorization();

    // if(user!.departmentId !== +departmentId){
    //   return checkUserPermissionByRole(user!, [PermissionEnum.VIEW_USER_REPORT] )
    // }

    return await prisma.task.findMany({
      where: {
        OR: [
          {assignerId: userId},
          {executorId: userId}
        ] // укажи нужный ID департамента
      },
      include: {
        assigner: {
          select: {
            username: true,
            email: true,
            position: true,
          },
        },
        executor: {
          select: {
            username: true,
            email: true,
            position: true,
          },
        },
      },
      orderBy: [{taskStatus: 'asc'}, {orderTask:"asc"}]
    });
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const getTask = async (taskId: string) => {
  try {
    await handleAuthorization();

    return await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        assigner: {
          select: {
            id: true,
            username: true,
            email: true,
            position: true,
          },
        },
        executor: {
          select: {
            id: true,
            username: true,
            email: true,
            position: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const createTask = async (task: Omit<TaskFormType, 'orderTask'>) => {
  try {
    const data = await handleAuthorization();
    const { userId } = data!;

    const lastTask = await prisma.task.findFirst({
      where: {
        departmentId: +task.departmentId,
        taskStatus: task.taskStatus as TaskStatus
      }
    })

    const newOrder = lastTask ? lastTask.orderTask + 1 : 0;

    await prisma.task.create({
      data: {
        ...task,
        departmentId: +task.departmentId,
        taskStatus: task.taskStatus as TaskStatus,
        taskPriority: task.taskPriority as TaskPriority,
        assignerId: userId,
        dueDate: new Date(task.dueDate),
        startDate: new Date(task.startDate),
        orderTask:newOrder
      },
      include: {
        assigner: {
          select: {
            id: true,
            username: true,
            email: true,
            position: true,
          },
        },
        executor: {
          select: {
            id: true,
            username: true,
            email: true,
            position: true,
          },
        },
      },
    });
    return { error: false, message: "Задача успешно создана", data: null };
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const updateTask = async (taskTarget: TaskFormTypeWithId) => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    const isOwner = userId === taskTarget.executorId;

    if (!isOwner) {
      await checkUserPermissionByRole(user!, [PermissionEnum.TASK_MANAGEMENT]);
    }

    const task = await prisma.task.findUnique({
      where: { id: taskTarget.id },
    });

    if (!task) {
      return handleError("Задача не найдена");
    }

    return await prisma.task.update({
      where: { id: taskTarget.id },
      data: {
        ...task,
        dueDate: new Date(task.dueDate),
        startDate: new Date(task.startDate),
      },
    });

  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

export const deleteTask = async (taskId: string, idTaskOwner: string) => {
  try {
    const data = await handleAuthorization();
    const { user, userId } = data!;

    if (!idTaskOwner) {
      return handleError("Недостаточно данных");
    }

    const isOwner = userId === idTaskOwner;

    if (!isOwner) {
      await checkUserPermissionByRole(user!, [PermissionEnum.TASK_MANAGEMENT]);
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return handleError("Задача не найдена");
    }

    return await prisma.task.delete({ where: { id: taskId } });
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
};

// export const getUsersAndTasksQuery = async (departmentId: string) => {
//   try {
//     return await getDepartmentUsersWithTasks(departmentId);
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       console.error("Prisma ошибка:", error.code);
//       TOAST.ERROR("Ошибка cхемы Prisma");
//     } else if (error instanceof Prisma.PrismaClientValidationError) {
//       console.error("Ошибка валидации:", error.message);
//       TOAST.ERROR("Ошибка валидации");
//     } else if (error instanceof Prisma.PrismaClientInitializationError) {
//       console.error("Ошибка подключения:", error.message);
//       TOAST.ERROR("Ошибка подключения");
//     } else {
//       console.error("Другая ошибка:", (error as Error).message);
//       TOAST.ERROR((error as Error).message);
//     }
//     throw error;
//   }
// };


export const updateTasksOrder = async (updatedTasks: TaskWithUserInfo[]) => {
  try {
      await handleAuthorization();

      const tasks = await prisma.$transaction(async (prisma) => {
        for(const task of updatedTasks){
            await prisma.task.update({
              where: {
                id: task.id
              },
              data: {
                taskStatus: task.taskStatus as TaskStatus,
                orderTask: task.orderTask
              }
            })
        }
      })

    return {success: true, data: tasks }
  } catch (error) {
    console.error(error);
    return handleError((error as Error).message);
  }
}