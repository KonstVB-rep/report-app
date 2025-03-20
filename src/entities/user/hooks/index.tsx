import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api";

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        return await getUser(userId as string);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 2,
  });
};
