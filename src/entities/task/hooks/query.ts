import useStoreUser from "@/entities/user/store/useStoreUser";
import { useQuery } from "@tanstack/react-query";
import { getTask, getTasksDepartment, getUserTasks } from "../api";
import { TOAST } from "@/shared/ui/Toast";
// import { getDepartmentTasks } from "../api/queryFn";

export const useGetTask = ( taskId: string) => {
const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["task", authUser?.id, taskId],
    queryFn: async () => {
      try {
        if (!authUser?.id) throw new Error("Пользователь не авторизован");

        return await getTask(taskId as string);
        
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!(taskId && authUser?.id),
  });
}


export const useGetUserTasks = () => {
const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["userTasks", authUser?.id],
    queryFn: async () => {
      try {
        if (!authUser?.id) throw new Error("Пользователь не авторизован");
        return await getUserTasks(authUser?.id);
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!(authUser?.id),
  });
}

export const useGetTasksDepartment = () => {
const { authUser } = useStoreUser();
  return useQuery({
    queryKey: ["tasks", authUser?.id, authUser?.departmentId],
    queryFn: async () => {
      try {
        if (!authUser?.id) throw new Error("Пользователь не авторизован");

        const departmentId = authUser?.departmentId
        return await getTasksDepartment(departmentId);
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!(authUser?.departmentId && authUser?.id),
  });
}

// export const useGetDepartmentTasks = (departmentId: string) => {
//   const { authUser, isAuth } = useStoreUser();

//   return useQuery({
//     queryKey: ["depsWithUsers", departmentId],
//     queryFn: async () => {
//       try {
//         if (!authUser?.id) {
//           throw new Error("Пользователь не авторизован");
//         }
//         return await getDepartmentTasks(departmentId);
//       } catch (error) {
//         console.log(error, "Ошибка useGetDepartmentsWithUsers");
//         TOAST.ERROR((error as Error).message);
//         return null
//       }
//     },
//     enabled: !!(isAuth && departmentId),
//   });
// };

