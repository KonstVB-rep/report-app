import { Role } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { usePathname } from "next/navigation";

import { DepartmentInfo } from "@/entities/department/types";
import {
  createUser,
  deleteUser,
  deleteUsersList,
  ResponseDelUser,
  updateUser,
} from "@/entities/user/api";
import {
  UserFormData,
  UserFormEditData,
  UserResponse,
} from "@/entities/user/types";
import { checkRole } from "@/shared/api/checkRole";
import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import handleErrorSession from "@/shared/auth/handleErrorSession";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";
import { checkTokens } from "@/shared/lib/helpers/checkTokens";
import { ActionResponse } from "@/shared/types";

export const useCreateUser = (
  onSuccessCallback?: (data: ActionResponse<UserFormData>) => void
) => {
  const { authUser, isSubmittingRef } = useFormSubmission();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => {
      return handleMutationWithAuthCheck<
        FormData,
        ActionResponse<UserFormData>
      >(createUser, data, authUser, isSubmittingRef);
    },
    onSuccess: (data) => {
      if (pathname.includes("adminboard")) {
        queryClient.invalidateQueries({
          queryKey: ["all-users"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["depsWithUsers"],
        });
      }
      if (!data.success) {
        TOAST.ERROR(data.message);
        onSuccessCallback?.(data);
        return;
      }
      if (data.success) {
        TOAST.SUCCESS(data.message);
      }
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      handleErrorSession(error);
    },
  });
};

export const useUpdateUser = (
  userId: string,
  onSuccessCallback?: (data: ActionResponse<UserFormEditData>) => void
) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: (formData: FormData) => {
      console.log("authUser", authUser);
      return handleMutationWithAuthCheck<
        FormData,
        ActionResponse<UserFormEditData>
      >(updateUser, formData, authUser, isSubmittingRef);
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ["user", userId, authUser?.id],
          exact: true,
        });
      }

      if (pathname.includes("adminboard")) {
        queryClient.invalidateQueries({
          queryKey: ["all-users"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["depsWithUsers"],
        });
      }

      if (data.success) {
        TOAST.SUCCESS("Данные успешно сохранены");
      }
      if (!data.success) {
        TOAST.ERROR(data.message);
      }

      onSuccessCallback?.(data);
    },
    onError: (error) => {
      handleErrorSession(error);
    },
  });
};

export const useDeleteUser = (userId: string) => {
  const { authUser, isSubmittingRef } = useFormSubmission();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const mutateFn = async (data: { userId: string }) => {
        await Promise.all([
          checkTokens(),
          checkRole(),
          checkRole(Role.DIRECTOR),
        ]);
        const result = await deleteUser(data);
        return result;
      };
      return handleMutationWithAuthCheck<
        { userId: string },
        ResponseDelUser<null>
      >(mutateFn, { userId }, authUser, isSubmittingRef);
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
      if (pathname.includes("adminboard")) {
        queryClient.invalidateQueries({
          queryKey: ["all-users"],
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["depsWithUsers"],
        });

        queryClient.refetchQueries({
          queryKey: ["depsWithUsers"],
        });
      }
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

export const useDeleteUsersList = (userIds: string[]) => {
  const { authUser, isSubmittingRef } = useFormSubmission();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const mutateFn = async (data: string[]) => {
        await Promise.all([
          checkTokens(),
          checkRole(),
          checkRole(Role.DIRECTOR),
        ]);
        const result = await deleteUsersList(data);
        return result;
      };
      return handleMutationWithAuthCheck<string[], ResponseDelUser<null>>(
        mutateFn,
        userIds,
        authUser,
        isSubmittingRef
      );
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
                (user: UserResponse) => !userIds.includes(user.id)
              ),
            };
          });
        }
      );
      return { previousDepsWithUsers };
    },
    onSuccess: async () => {
      if (pathname.includes("adminboard")) {
        queryClient.invalidateQueries({
          queryKey: ["all-users"],
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["depsWithUsers"],
        });

        queryClient.refetchQueries({
          queryKey: ["depsWithUsers"],
        });
      }
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
