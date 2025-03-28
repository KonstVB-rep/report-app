import { getDepartmentsWithUsersQuery } from "../api/queryFn";

export const useGetDepartmentsWithUsers = () => ({
    queryKey: ["depsWithUsers"],
    queryFn: getDepartmentsWithUsersQuery,
    refetchOnWindowFocus: false,
  });

