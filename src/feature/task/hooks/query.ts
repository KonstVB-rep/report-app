import { useQuery } from "@tanstack/react-query"
import { getTask, getTasksDepartment, getUserTasks } from "@/entities/task/api"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { TOAST } from "@/shared/custom-components/ui/Toast"

export const useGetTask = (taskId: string) => {
  const { authUser } = useStoreUser()
  return useQuery({
    queryKey: ["task", authUser?.id, taskId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован")
        }

        return await getTask(taskId as string)
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!(taskId && authUser?.id),
  })
}

export const useGetUserTasks = () => {
  const { authUser } = useStoreUser()
  return useQuery({
    queryKey: ["userTasks", authUser?.id],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован")
        }

        return await getUserTasks(authUser?.id)
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!authUser?.id,
  })
}

export const useGetTasksDepartment = () => {
  const { authUser } = useStoreUser()
  return useQuery({
    queryKey: ["tasks", authUser?.id, authUser?.departmentId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован")
        }

        const departmentId = authUser.departmentId

        return await getTasksDepartment(departmentId)
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!(authUser?.departmentId && authUser?.id),
  })
}
