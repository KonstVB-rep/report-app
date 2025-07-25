import { useQuery } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { checkAuthorization } from "@/shared/lib/helpers/checkAuthorization";
import { TOAST } from "@/shared/ui/Toast";

import { getTask, getTasksDepartment, getUserTasks } from "../api";

export const useGetTask = (taskId: string) => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["task", authUser?.id, taskId],
    queryFn: async () => {
      try {
        await checkAuthorization(authUser?.id);

        return await getTask(taskId as string);
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные");
        } else {
          TOAST.ERROR((error as Error).message);
        }
        throw error;
      }
    },
    enabled: !!(taskId && authUser?.id),
  });
};

export const useGetUserTasks = () => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["userTasks", authUser?.id],
    queryFn: async () => {
      try {
        await checkAuthorization(authUser?.id);

        return await getUserTasks(authUser!.id);
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные");
        } else {
          TOAST.ERROR((error as Error).message);
        }
        throw error;
      }
    },
    enabled: !!authUser?.id,
  });
};

export const useGetTasksDepartment = () => {
  const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["tasks", authUser?.id, authUser?.departmentId],
    queryFn: async () => {
      try {
        await checkAuthorization(authUser?.id);

        const departmentId = authUser!.departmentId;
        return await getTasksDepartment(departmentId);
      } catch (error) {
        if ((error as Error).message === "Failed to fetch") {
          TOAST.ERROR("Не удалось получить данные");
        } else {
          TOAST.ERROR((error as Error).message);
        }
        throw error;
      }
    },
    enabled: !!(authUser?.departmentId && authUser?.id),
  });
};
