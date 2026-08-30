"use client"
import { useQuery } from "@tanstack/react-query"
import { getTasksDepartment, getUserTasks } from "@/entities/task/api/task.actions"
import useStoreUser from "@/entities/user/store/useStoreUser"
import { TOAST } from "@/shared/custom-components/ui/Toast"

export const useGetUserTasks = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["userTasks", userId],
    queryFn: async () => {
      try {
        return await getUserTasks(userId)
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные")
        } else {
          TOAST.ERROR((error as Error).message)
        }
        throw error
      }
    },
    enabled: !!userId,
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
