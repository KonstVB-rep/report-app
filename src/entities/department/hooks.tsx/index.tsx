import { useQuery } from "@tanstack/react-query";
import { getDepartmentsWithUsersQuery } from "../api/queryFn";

export const useGetDepartmentsWithUsers = () => {
  return useQuery({
    queryKey: ["depsWithUsers"],
    queryFn: getDepartmentsWithUsersQuery,
    refetchOnWindowFocus: false,
  });
};
