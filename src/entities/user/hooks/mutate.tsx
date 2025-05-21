import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { getQueryClient } from "@/app/provider/query-provider";
import { DepartmentInfo } from "@/entities/department/types";
import { TOAST } from "@/shared/ui/Toast";

import { createUser, deleteUser, updateUser } from "../api";
import { userEditSchema, userSchema } from "../model/schema";
import {
  DepartmentTypeName,
  PermissionType,
  RoleType,
  UserRequest,
  UserResponse,
} from "../types";

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

export const useUpdateUser = (
  user: UserResponse,
  setOpen: (value: boolean) => void
) => {
  return useMutation({
    mutationFn: (data: userEditSchema) => updateUser(data as UserRequest),
    onSuccess: () => {
      setOpen(false);
      if (user) {
        queryClient.invalidateQueries({
          queryKey: ["user", user.id],
          exact: true,
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["depsWithUsers"],
        exact: true,
      });
    },
  });
};
