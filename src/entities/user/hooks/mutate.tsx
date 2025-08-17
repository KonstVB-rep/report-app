import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { getQueryClient } from "@/app/provider/query-provider";
import { DepartmentInfo } from "@/entities/department/types";
import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import handleErrorSession from "@/shared/auth/handleErrorSession";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";

import { createUser, deleteUser, ResponseDelUser, updateUser } from "../api";
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
  const { authUser, isSubmittingRef } = useFormSubmission();
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
      return handleMutationWithAuthCheck<UserRequest, UserResponse | undefined>(
        createUser,
        user,
        authUser,
        isSubmittingRef
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["depsWithUsers"],
      });
    },
    onError: (error) => {
      handleErrorSession(error);
    },
  });
};

export const useDeleteUser = (userId: string) => {
  const router = useRouter();
  const { authUser, isSubmittingRef } = useFormSubmission();

  return useMutation({
    mutationFn: async () => {
      return handleMutationWithAuthCheck<
        { userId: string },
        ResponseDelUser<null>
      >(deleteUser, { userId }, authUser, isSubmittingRef);
    },
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
      handleErrorSession(error);
    },
  });
};

export const useUpdateUser = (
  user: UserResponse,
  setOpen: (value: boolean) => void
) => {
  const { authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: (data: userEditSchema) => {
      const updateData = data as UserRequest;
      return handleMutationWithAuthCheck<UserRequest, UserResponse | undefined>(
        updateUser,
        updateData,
        authUser,
        isSubmittingRef
      );
    },
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
    onError: (error) => {
      handleErrorSession(error);
    },
  });
};
