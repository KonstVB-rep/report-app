"use server"

import { PermissionEnum, type Task } from "@prisma/client"
import { AxiosError } from "axios"
import { cacheTag, revalidateTag } from "next/cache"
import { checkUserPermissionByRole } from "@/app/api/utils/checkUserPermissionByRole"
import { requireUser } from "@/app/api/utils/requireAuth"
import type { DeleteTaskData, TaskFormType, TaskFormTypeWithId } from "@/feature/task/types"
import { sendNotify } from "@/feature/telegramBot/actions/send-notify"
import { prisma } from "@/prisma/prisma-client"
import { handleError } from "@/shared/api/handleError"
import { formatDateTime } from "@/shared/lib/helpers/formatDate"
import type { TaskWithUserInfo } from "../types"

export const getTasksDepartment = async (
  departmentId: number,
): Promise<TaskWithUserInfo[] | null> => {
  try {
    const user = await requireUser()

    if (user?.departmentId !== departmentId) {
      await checkUserPermissionByRole(user, [PermissionEnum.TASK_MANAGEMENT])
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

export const getUserTasks = async (userId: string): Promise<TaskWithUserInfo[] | null> => {
  try {
    const user = await requireUser()

    if (user?.userId !== userId) {
      await checkUserPermissionByRole(user, [PermissionEnum.VIEW_USER_REPORT])
    }

    const select = { username: true, email: true, position: true }

    return await prisma.task.findMany({
      where: {
        OR: [{ assignerId: userId }, { executorId: userId }],
      },
      include: {
        assigner: {
          select,
        },
        executor: {
          select,
        },
      },
      orderBy: [{ taskStatus: "asc" }, { orderTask: "asc" }],
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const createTask = async (task: Omit<TaskFormType, "orderTask">) => {
  try {
    const user = await requireUser()

    const { userId } = user

    const agg = await prisma.task.aggregate({
      where: {
        departmentId: Number(task.departmentId),
        taskStatus: task.taskStatus,
      },
      _max: { orderTask: true },
    })
    const newOrder = (agg._max.orderTask ?? -1) + 1

    const [newTask, chatData] = await Promise.all([
      prisma.task.create({
        data: {
          ...task,
          departmentId: Number(task.departmentId),
          assignerId: userId,
          dueDate: new Date(task.dueDate),
          startDate: new Date(task.startDate),
          orderTask: newOrder,
        },
        include: {
          assigner: { select: { username: true } },
        },
      }),
      prisma.userTelegramChat.findUnique({
        where: { id: userId, chatName: "tasksChat" },
      }),
    ])

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

    revalidateTag(`task-count-${newTask.assignerId}`, "max")
    revalidateTag(`task-count-${newTask.executorId}`, "max")

    return {
      error: false,
      message: "Задача успешно создана",
      data: newTask,
      telegramError,
    }
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const updateTask = async (taskTarget: TaskFormTypeWithId): Promise<Task> => {
  try {
    const user = await requireUser()

    if (user.userId !== taskTarget.executorId) {
      await checkUserPermissionByRole(user, [PermissionEnum.TASK_MANAGEMENT])
    }

    const { id, ...dataToUpdate } = taskTarget

    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return handleError("Задача не найдена")
    }

    return await prisma.task.update({
      where: { id },
      data: {
        ...dataToUpdate,
        dueDate: new Date(taskTarget.dueDate),
        startDate: new Date(taskTarget.startDate),
      },
    })
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

const getTaskCountCache = async (userId: string): Promise<number> => {
  "use cache"
  cacheTag(`task-count-${userId}`)

  return await prisma.task.count({
    where: {
      OR: [{ assignerId: userId }, { executorId: userId }],
    },
  })
}

export const getTaskCount = async (userId: string): Promise<number> => {
  try {
    return getTaskCountCache(userId)
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}

export const deleteTask = async (taskData: DeleteTaskData): Promise<Task> => {
  try {
    const user = await requireUser()

    const { taskId, idTaskOwner } = taskData // idTaskOwner — это создатель задачи

    if (!idTaskOwner) return handleError("Недостаточно данных")

    if (user.userId !== idTaskOwner) {
      await checkUserPermissionByRole(user, [PermissionEnum.TASK_MANAGEMENT])
    }

    const task = await prisma.task.delete({
      where: { id: taskId },
    })
    revalidateTag(`task-count-${task.assignerId}`, "max")
    revalidateTag(`task-count-${task.executorId}`, "max")

    return task
  } catch (error) {
    console.log(error, "deleteTask")
    return handleError("Ошибка при удалении: задача не найдена")
  }
}

export const updateTasksOrder = async (
  updatedTasks: TaskWithUserInfo[],
): Promise<{ success: boolean; data: Task[] }> => {
  try {
    await requireUser()

    const tasks = await prisma.$transaction(
      updatedTasks.map((task) =>
        prisma.task.update({
          where: { id: task.id },
          data: {
            taskStatus: task.taskStatus,
            orderTask: task.orderTask,
          },
        }),
      ),
    )

    return { success: true, data: tasks }
  } catch (error) {
    console.error(error)
    return handleError((error as Error).message)
  }
}
