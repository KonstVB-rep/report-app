import { Role } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { getQueryClient } from "@/app/provider/query-provider";
import { DepartmentInfo } from "@/entities/department/types";
import {
  createUser,
  deleteUser,
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

const queryClient = getQueryClient();

export const useCreateUser = (
  onSuccessCallback?: (data: ActionResponse<UserFormData>) => void
) => {
  const { authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: (data: FormData) => {
      return handleMutationWithAuthCheck<
        FormData,
        ActionResponse<UserFormData>
      >(createUser, data, authUser, isSubmittingRef);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["depsWithUsers"],
      });
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
  const { authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: (formData: FormData) => {
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
      queryClient.invalidateQueries({
        queryKey: ["depsWithUsers"],
        exact: true,
      });
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
