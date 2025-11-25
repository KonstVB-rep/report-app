"use server"

import { PermissionEnum, type Task } from "@prisma/client"
import { AxiosError } from "axios"
import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole"
import { handleAuthorization } from "@/app/api/utils/handleAuthorization"
import type { DeleteTaskData, TaskFormType, TaskFormTypeWithId } from "@/feature/task/types"
import { sendNotify } from "@/feature/telegramBot/actions/send-notify"
import { prisma } from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import { formatDateTime } from "@/shared/lib/helpers/formatDate"
import type { TaskWithUserInfo } from "../types"

export const getTasksDepartment = async (
  departmentId: number,
): Promise<TaskWithUserInfo[] | [] | null> => {
  try {
    const { user } = await handleAuthorization()

    if (user?.departmentId !== departmentId) {
      return checkUserPermissionByRole(user, [PermissionEnum.TASK_MANAGEMENT])
    }

    return await prisma.task.findMany({
      where: {
        departmentId,
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
      orderBy: [{ taskStatus: "asc" }, { orderTask: "asc" }],
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const getUserTasks = async (userId: string): Promise<TaskWithUserInfo[] | []> => {
  try {
    await handleAuthorization()

    // if(user!.departmentId !== +departmentId){
    //   return checkUserPermissionByRole(user!, [PermissionEnum.VIEW_USER_REPORT] )
    // }

    return await prisma.task.findMany({
      where: {
        OR: [{ assignerId: userId }, { executorId: userId }],
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
      orderBy: [{ taskStatus: "asc" }, { orderTask: "asc" }],
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const getTask = async (taskId: string) => {
  try {
    await handleAuthorization()

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
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const createTask = async (task: Omit<TaskFormType, "orderTask">) => {
  try {
    const data = await handleAuthorization()

    const { userId } = data

    const lastTask = await prisma.task.findFirst({
      where: {
        departmentId: +task.departmentId,
        taskStatus: task.taskStatus,
      },
    })

    const newOrder = lastTask ? lastTask.orderTask + 1 : 0

    const newTask = await prisma.task.create({
      data: {
        ...task,
        departmentId: task.departmentId,
        assignerId: userId,
        dueDate: new Date(task.dueDate),
        startDate: new Date(task.startDate),
        orderTask: newOrder,
      },
      include: {
        assigner: {
          select: { id: true, username: true, email: true, position: true },
        },
        executor: {
          select: { id: true, username: true, email: true, position: true },
        },
      },
    })

    const chatData = await prisma.userTelegramChat.findUnique({
      where: { id: userId, chatName: "tasksChat" },
    })

    const botName = process.env.TELEGRAM_BOT_ERTEL_TASK_NAME || ""
    const description = task.description
    const taskPriority = task.taskPriority
    // const executorManager = task.executorId;
    const timeMakeUpTask = formatDateTime(task.dueDate)

    const message = `<b>Новая задача</b>: ${description}
<b>От кого:</b> ${newTask.assigner?.username}
<b>Приоритет</b>: ${taskPriority}
<b>Срок исполнения</b>: ${timeMakeUpTask}`

    // --- отправка в Telegram ---
    let telegramError: string | undefined

    try {
      const sendData = await sendNotify(message, chatData?.chatId || "", botName)

      if (!sendData || sendData.status !== 200) {
        telegramError =
          (sendData?.data?.description as string) || "Ошибка при отправке уведомления в Telegram"
      }
    } catch (notifyError) {
      console.error("Ошибка отправки уведомления:", notifyError)

      if (notifyError instanceof AxiosError) {
        telegramError =
          (notifyError.response?.data?.description as string) ||
          notifyError.response?.statusText ||
          notifyError.message
      } else {
        telegramError = (notifyError as Error).message
      }
    }

    return {
      error: false,
      message: "Задача успешно создана",
      data: null,
      telegramError,
    }
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const updateTask = async (taskTarget: TaskFormTypeWithId): Promise<Task> => {
  try {
    const data = await handleAuthorization()

    const { user, userId } = data

    const isOwner = userId === taskTarget.executorId

    if (!isOwner) {
      await checkUserPermissionByRole(user, [PermissionEnum.TASK_MANAGEMENT])
    }

    const task = await prisma.task.findUnique({
      where: { id: taskTarget.id },
    })

    if (!task) {
      return handleError("Задача не найдена")
    }

    return await prisma.task.update({
      where: { id: taskTarget.id },
      data: {
        ...taskTarget,
        dueDate: new Date(taskTarget.dueDate),
        startDate: new Date(taskTarget.startDate),
      },
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const deleteTask = async (taskData: DeleteTaskData): Promise<Task> => {
  try {
    const data = await handleAuthorization()

    const { user, userId } = data

    const { taskId, idTaskOwner } = taskData

    if (!idTaskOwner) {
      return handleError("Недостаточно данных")
    }

    const isOwner = userId === idTaskOwner

    if (!isOwner) {
      if (user) {
        await checkUserPermissionByRole(user, [PermissionEnum.TASK_MANAGEMENT])
      }
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return handleError("Задача не найдена")
    }

    return await prisma.task.delete({ where: { id: taskId } })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const updateTasksOrder = async (
  updatedTasks: TaskWithUserInfo[],
): Promise<{ success: boolean; data: Task[] }> => {
  try {
    await handleAuthorization()

    const tasks: Task[] = await prisma.$transaction(async (tx) => {
      const updatePromises = updatedTasks.map((task) =>
        tx.task.update({
          where: { id: task.id },
          data: {
            taskStatus: task.taskStatus,
            orderTask: task.orderTask,
          },
        }),
      )

      return Promise.all(updatePromises)
    })

    return { success: true, data: tasks }
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}
