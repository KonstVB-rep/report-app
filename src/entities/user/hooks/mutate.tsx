import { getQueryClient } from "@/app/provider/query-provider";
import { useMutation } from "@tanstack/react-query";
import {
  createUser,

  deleteUser,
} from "../api";
import { userSchema } from "../model/schema";
import {
  UserRequest,
  DepartmentTypeName,
  RoleType,
  PermissionType,
  UserResponse,
} from "../types";
import { useRouter } from "next/navigation";
import { TOAST } from "../ui/Toast";
import { DepartmentInfo } from "@/entities/department/types";

const queryClient = getQueryClient();

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: userSchema) => {
      const user: UserRequest = {
        username: data.username,
        email: data.email,
        phone: data.phone,
        position: data.position,
        user_password: data.user_password,
        department: data.department as DepartmentTypeName,
        role: data.role as RoleType,
        permissions: data.permissions as PermissionType[],
      };
      return createUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["depsWithUsers"],
      });
    },
    onError: (error) => {
      TOAST.ERROR(error.message);
    },
  });
};

export const useDeleteUser = (userId: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteUser(userId),
    onMutate: async () => {
      const previousDepsWithUsers = queryClient.getQueryData(["depsWithUsers"]);

      queryClient.setQueryData(
        ["depsWithUsers"],
        (oldData: DepartmentInfo[]) => {
          return oldData.map((department: DepartmentInfo) => {
            return {
              ...department,
              users: department.users.filter(
                (user: UserResponse) => user.id !== userId
              ),
            };
          });
        }
      );

      return { previousDepsWithUsers };
    },
    onSuccess: async () => {
      router.back();

      await queryClient.invalidateQueries({
        queryKey: ["depsWithUsers"],
      });

      queryClient.refetchQueries({
        queryKey: ["depsWithUsers"],
      });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["depsWithUsers"],
        context?.previousDepsWithUsers
      );
      TOAST.ERROR(error.message);
    },
  });
};

