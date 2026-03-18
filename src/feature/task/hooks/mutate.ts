import { useMutation } from "@tanstack/react-query"
import {
  createTask,
  deleteTask,
  updateTask,
  updateTasksOrder,
} from "@/entities/task/api/task.actions"
import type { TaskWithUserInfo } from "@/entities/task/types"
import handleErrorSession from "@/shared/auth/handleErrorSession"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import type { TaskFormType, TaskFormTypeWithId } from "../types"

export const useCreateTask = () => {
  const { queryClient, authUser } = useFormSubmission()

  return useMutation({
    mutationFn: async (task: Omit<TaskFormType, "orderTask">) => await createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", authUser?.id, authUser?.departmentId],
      })
      queryClient.invalidateQueries({
        queryKey: ["userTasks", authUser?.id],
      })
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useUpdateTask = () => {
  const { queryClient, authUser } = useFormSubmission()

  return useMutation({
    mutationFn: async (task: TaskFormTypeWithId) => await updateTask(task),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", authUser?.id, authUser?.departmentId],
      })
      queryClient.invalidateQueries({
        queryKey: ["task", authUser?.id, data?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ["userTasks", authUser?.id],
      })
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useDeleteTask = (close: () => void) => {
  const { queryClient, authUser } = useFormSubmission()

  return useMutation({
    mutationFn: async (data: { taskId: string; idTaskOwner: string }) => {
      if (authUser?.id !== data.idTaskOwner) {
        TOAST.ERROR("Удалить задание может только ее автор")
        return
      }
      const dataRemove = { taskId: data.taskId, idTaskOwner: data.idTaskOwner }
      return await deleteTask(dataRemove)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", authUser?.id, data?.departmentId],
      })
      queryClient.invalidateQueries({
        queryKey: ["task", authUser?.id, data?.id],
      })
      queryClient.invalidateQueries({
        queryKey: ["userTasks", authUser?.id],
      })

      close()
      TOAST.SUCCESS("Задача удалена")
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useUpdateTasksOrder = () => {
  const { queryClient, authUser } = useFormSubmission()

  return useMutation({
    mutationFn: async (data: { updatedTasks: TaskWithUserInfo[] }) => {
      return await updateTasksOrder(data.updatedTasks)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", authUser?.id, authUser?.departmentId],
      })
      queryClient.invalidateQueries({
        queryKey: ["userTasks", authUser?.id],
      })
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}
