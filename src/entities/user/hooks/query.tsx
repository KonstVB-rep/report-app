import { useQuery } from "@tanstack/react-query";
import { getUser, getUserShort } from "../api";
import { UserWithdepartmentName } from "../types";
import { TOAST } from "../ui/Toast";
import { PermissionEnum } from "@prisma/client";

export const useGetUser = (userId: string, permissions?: PermissionEnum[] | undefined) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        return await getUser(userId as string, permissions as PermissionEnum[]);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    enabled: !!userId,
    retry: 2,
  });
};

export const useGetUserShortInfo = (userId: string) => {
  return useQuery<UserWithdepartmentName | undefined>({
    queryKey: ["user-short", userId],
    queryFn: async () => {
      try {
        return (await getUserShort(userId)) as UserWithdepartmentName;
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
  });
};
