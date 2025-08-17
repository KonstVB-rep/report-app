import { Task } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import handleErrorSession from "@/shared/auth/handleErrorSession";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";

import { createTask, deleteTask, updateTask, updateTasksOrder } from "../api";
import {
  CreateTaskReturn,
  DeleteTaskData,
  TaskFormType,
  TaskFormTypeWithId,
  TaskWithUserInfo,
} from "../types";

export const useCreateTask = () => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (task: Omit<TaskFormType, "orderTask">) => {
      return handleMutationWithAuthCheck<
        Omit<TaskFormType, "orderTask">,
        CreateTaskReturn
      >(createTask, task, authUser, isSubmittingRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", authUser?.id, authUser?.departmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userTasks", authUser?.id],
      });
    },
    onError: (error) => {
      handleErrorSession(error);
    },
  });
};

export const useUpdateTask = () => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (task: TaskFormTypeWithId) => {
      return handleMutationWithAuthCheck<TaskFormTypeWithId, Task>(
        updateTask,
        task,
        authUser,
        isSubmittingRef
      );
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
      handleErrorSession(error);
    },
  });
};

export const useDeleteTask = (close: () => void) => {
  const { queryClient, authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async (data: { taskId: string; idTaskOwner: string }) => {
      if (authUser?.id !== data.idTaskOwner) {
        TOAST.ERROR("Удалить задание может только ее автор");
        return;
      }
      const dataRemove = { taskId: data.taskId, idTaskOwner: data.idTaskOwner };
      return handleMutationWithAuthCheck<DeleteTaskData, Task>(
        deleteTask,
        dataRemove,
        authUser,
        isSubmittingRef
      );
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
      handleErrorSession(error);
    },
  });
};

export const useUpdateTasksOrder = () => {
  const { queryClient, authUser } = useFormSubmission();

  return useMutation({
    mutationFn: async (data: { updatedTasks: TaskWithUserInfo[] }) => {
      return await updateTasksOrder(data.updatedTasks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", authUser?.id, authUser?.departmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["userTasks", authUser?.id],
      });
    },
    onError: (error) => {
      handleErrorSession(error);
    },
  });
};
