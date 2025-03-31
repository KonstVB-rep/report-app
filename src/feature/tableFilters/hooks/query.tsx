
import useStoreUser from "@/entities/user/store/useStoreUser";
import { TOAST } from "@/entities/user/ui/Toast";
import { useQuery } from "@tanstack/react-query";
import { getUserFilters, getUserFilterById } from "../api";

export const useGetUserFilters = () => {
    const { authUser } = useStoreUser();
    return useQuery({
      queryKey: ["filters", authUser?.id],
      queryFn: async () => {
        try {
          if (!authUser?.id) {
            throw new Error("Пользователь не авторизован");
          }
          return await getUserFilters();
        } catch (error) {
          TOAST.ERROR((error as Error).message);
        }
      },
    });
  };
  
  export const useGetUserFilterById = (filterId: string) => {
    const { authUser } = useStoreUser();
    return useQuery({
      queryKey: ["filters", [authUser?.id, filterId]],
      queryFn: async () => {
        try {
          if (!authUser?.id) {
            throw new Error("Пользователь не авторизован");
          }
          return await getUserFilterById(filterId);
        } catch (error) {
          TOAST.ERROR((error as Error).message);
        }
      },
      refetchOnMount: true,
      staleTime: 0,
    });
  };
  