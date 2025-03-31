import { useQuery } from "@tanstack/react-query";
import { getDepartmentsWithUsersQuery } from "../api/queryFn";
import { TOAST } from "@/entities/user/ui/Toast";
import useStoreUser from "@/entities/user/store/useStoreUser";

export const useGetDepartmentsWithUsers = (isAuth: boolean) => {
  const { authUser } = useStoreUser();

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
        TOAST.ERROR((error as Error).message);
      }
    },
    enabled: isAuth,
  });
};
