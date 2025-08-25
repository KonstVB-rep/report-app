import { useMutation } from "@tanstack/react-query";

import { getQueryClient } from "@/app/provider/query-provider";
import { DepartmentInfo } from "@/entities/department/types";
import handleMutationWithAuthCheck from "@/shared/api/handleMutationWithAuthCheck";
import handleErrorSession from "@/shared/auth/handleErrorSession";
import { TOAST } from "@/shared/custom-components/ui/Toast";
import { useFormSubmission } from "@/shared/hooks/useFormSubmission";
import { ActionResponse } from "@/shared/types";

import {
  createUser,
  deleteUser,
  ResponseDelUser,
  updateUser
} from "@/entities/user/api";
import {
  UserFormData,
  UserResponse
} from "@/entities/user/types";
import { checkRole } from "@/shared/api/checkRole";
import { checkTokens } from "@/shared/lib/helpers/checkTokens";
import { Role } from "@prisma/client";

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
      onSuccessCallback?.(data);
      if (data.success) {
        TOAST.SUCCESS(data.message) ;
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
  onSuccessCallback?: (data: ActionResponse<UserFormData>) => void
) => {
  const { authUser, isSubmittingRef } = useFormSubmission();
  return useMutation({
    mutationFn: (formData: FormData) => {
      return handleMutationWithAuthCheck<
        FormData,
        ActionResponse<UserFormData>
      >(updateUser, formData, authUser, isSubmittingRef);
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ["user", userId],
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
      onSuccessCallback?.(data);
    },
    onError: (error) => {
      handleErrorSession(error);
    },
  });
};

// export const useCreateUser = () => {
//   const { authUser, isSubmittingRef } = useFormSubmission();
//   return useMutation({
//     mutationFn: (data: userSchema) => {
//       const user: UserRequest = {
//         username: data.username,
//         email: data.email,
//         phone: data.phone,
//         position: data.position,
//         user_password: data.user_password,
//         department: data.department as DepartmentTypeName,
//         role: data.role as Role,
//         permissions: data.permissions as PermissionType[],
//       };
//       return handleMutationWithAuthCheck<UserRequest, UserResponse | undefined>(
//         createUser,
//         user,
//         authUser,
//         isSubmittingRef
//       );
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["depsWithUsers"],
//       });
//     },
//     onError: (error) => {
//       handleErrorSession(error);
//     },
//   });
// };

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

// export const useUpdateUser = (
//   user: UserResponse,
//   setOpen: (value: boolean) => void
// ) => {
//   const { authUser, isSubmittingRef } = useFormSubmission();
//   return useMutation({
//     mutationFn: (data: userEditSchema) => {
//       const updateData = data as UserRequest;
//       return handleMutationWithAuthCheck<UserRequest, UserResponse | undefined>(
//         updateUser,
//         updateData,
//         authUser,
//         isSubmittingRef
//       );
//     },
//     onSuccess: () => {
//       setOpen(false);
//       if (user) {
//         queryClient.invalidateQueries({
//           queryKey: ["user", user.id],
//           exact: true,
//         });
//       }
//       queryClient.invalidateQueries({
//         queryKey: ["depsWithUsers"],
//         exact: true,
//       });
//     },
//     onError: (error) => {
//       handleErrorSession(error);
//     },
//   });
// };
