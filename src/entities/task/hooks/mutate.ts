import { useMutation, useQueryClient } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import { createTask, deleteTask, updateTask, updateTasksOrder } from "../api";
import { TaskFormType, TaskFormTypeWithId, TaskWithUserInfo } from "../types";

export const useCreateTask = () => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: Omit<TaskFormType, "orderTask">) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return await createTask(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", authUser?.id, authUser?.departmentId],
      });
    },
    onError: (error) => {
      console.log(error);
      TOAST.ERROR("Произошла ошибка при попытке создания задачи");
    },
  });
};

export const useUpdateTask = () => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskTarget: TaskFormTypeWithId) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return await updateTask(taskTarget);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", authUser?.id, authUser?.departmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", authUser?.id, data?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userTasks", authUser?.id],
      });
    },
    onError: (error) => {
      console.log(error);
      TOAST.ERROR("Произошла ошибка при попытке обновления задачи");
    },
  });
};

export const useDeleteTask = (close: () => void) => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { taskId: string; idTaskOwner: string }) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }

      if (authUser.id !== data.idTaskOwner) {
        TOAST.ERROR("Удалить задание может только ее автор");
        return;
      }
      return await deleteTask(data.taskId, data.idTaskOwner);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", authUser?.id, data?.departmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", authUser?.id, data?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userTasks", authUser?.id],
      });

      close();
      TOAST.SUCCESS("Задача удалена");
    },
    onError: (error) => {
      console.log(error);
      TOAST.ERROR("Произошла ошибка при попытке удаления задачи");
    },
  });
};

export const useUpdateTasksOrder = () => {
  const { authUser } = useStoreUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { updatedTasks: TaskWithUserInfo[] }) => {
      if (!authUser?.id) {
        throw new Error("Пользователь не авторизован");
      }
      return await updateTasksOrder(data.updatedTasks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", authUser?.id, authUser?.departmentId],
      });
    },
    onError: (error) => {
      console.log(error);
      TOAST.ERROR("Произошла ошибка при попытке обновления задачи");
    },
  });
};
