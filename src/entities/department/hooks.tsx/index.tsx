import { useQuery } from "@tanstack/react-query";
import { getDepartmentsWithUsers } from "../api";
import { TOAST } from "@/entities/user/ui/Toast";

export const useGetDepartmentsWithUsers = () => {
  return useQuery({
    queryKey: ["depsWithEmp"],
    queryFn: async () => {
      try {
        return await getDepartmentsWithUsers();
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
  },
);
}
