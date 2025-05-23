import { useQuery } from "@tanstack/react-query";

import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/shared/ui/Toast";

import { getDepartmentsWithUsersQuery, getDepartmentWithUsersAndTasksQuery } from "../api/queryFn";

export const useGetDepartmentsWithUsers = () => {
  const { authUser, isAuth } = useStoreUser();

  return useQuery({
    queryKey: ["depsWithUsers"],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getDepartmentsWithUsersQuery();
      } catch (error) {
        console.log(error, "Ошибка useGetDepartmentsWithUsers");
        TOAST.ERROR((error as Error).message)
        return null
      }
    },
    enabled: isAuth,
  });
};


export const useGetDepartmentWithUsersAndTasks = (departmentId: string) => {
  const { authUser, isAuth } = useStoreUser();

  return useQuery({
    queryKey: ["depsWithUsers", departmentId],
    queryFn: async () => {
      try {
        if (!authUser?.id) {
          throw new Error("Пользователь не авторизован");
        }
        return await getDepartmentWithUsersAndTasksQuery(departmentId);
      } catch (error) {
        console.log(error, "Ошибка useGetDepartmentsWithUsers");
        TOAST.ERROR((error as Error).message);
        return null
      }
    },
    enabled: !!(isAuth && departmentId),
  });
};
