import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import type { DepartmentInfo } from "@/entities/department/types"
import {
  createUser,
  deleteUser,
  deleteUsersList,
  updateUser,
} from "@/entities/user/api/user.actions"
import type { UserFormData, UserFormEditData, UserResponse } from "@/entities/user/types"
import handleErrorSession from "@/shared/auth/handleErrorSession"
import { TOAST } from "@/shared/custom-components/ui/Toast"
import { useFormSubmission } from "@/shared/hooks/useFormSubmission"
import type { ActionResponse } from "@/shared/types"

export const useCreateUser = (onSuccessCallback?: (data: ActionResponse<UserFormData>) => void) => {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: FormData) => await createUser(data),
    onSuccess: (data) => {
      if (pathname.includes("adminboard")) {
        queryClient.invalidateQueries({
          queryKey: ["all-users"],
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: ["depsWithUsers"],
        })
      }
      if (!data.success) {
        TOAST.ERROR(data.message)
        onSuccessCallback?.(data)
        return
      }
      if (data.success) {
        TOAST.SUCCESS(data.message)
      }
      onSuccessCallback?.(data)
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useUpdateUser = (
  userId: string,
  onSuccessCallback?: (data: ActionResponse<UserFormEditData>) => void,
) => {
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const { authUser } = useFormSubmission()
  return useMutation({
    mutationFn: async (formData: FormData) => await updateUser(formData),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ["user", userId, authUser?.id],
          exact: true,
        })
      }

      if (pathname.includes("adminboard")) {
        queryClient.invalidateQueries({
          queryKey: ["all-users"],
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: ["depsWithUsers"],
        })
      }

      if (data.success) {
        TOAST.SUCCESS("Данные успешно сохранены")
      }
      if (!data.success) {
        TOAST.ERROR(data.message)
      }

      onSuccessCallback?.(data)
    },
    onError: (error) => {
      handleErrorSession(error)
    },
  })
}

export const useDeleteUser = (userId: string) => {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => await deleteUser(userId),
    onMutate: async () => {
      const previousDepsWithUsers = queryClient.getQueryData(["depsWithUsers"])

      queryClient.setQueryData(["depsWithUsers"], (oldData: DepartmentInfo[]) => {
        if (!Array.isArray(oldData)) return oldData
        return oldData.map((department: DepartmentInfo) => {
          return {
            ...department,
            users: department.users.filter((user: UserResponse) => user.id !== userId),
          }
        })
      })
      return { previousDepsWithUsers }
    },
    onSuccess: async () => {
      if (pathname.includes("adminboard")) {
        queryClient.invalidateQueries({
          queryKey: ["all-users"],
        })
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["depsWithUsers"],
        })

        queryClient.refetchQueries({
          queryKey: ["depsWithUsers"],
        })
      }
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(["depsWithUsers"], context?.previousDepsWithUsers)
      handleErrorSession(error)
    },
  })
}

export const useDeleteUsersList = (userIds: string[]) => {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => await deleteUsersList(userIds),
    onMutate: async () => {
      const previousDepsWithUsers = queryClient.getQueryData(["depsWithUsers"])

      queryClient.setQueryData(["depsWithUsers"], (oldData: DepartmentInfo[]) => {
        if (!Array.isArray(oldData)) return oldData
        return oldData.map((department: DepartmentInfo) => {
          return {
            ...department,
            users: department.users.filter((user: UserResponse) => !userIds.includes(user.id)),
          }
        })
      })
      return { previousDepsWithUsers }
    },
    onSuccess: async () => {
      if (pathname.includes("adminboard")) {
        queryClient.invalidateQueries({
          queryKey: ["all-users"],
        })
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["depsWithUsers"],
        })

        queryClient.refetchQueries({
          queryKey: ["depsWithUsers"],
        })
      }
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(["depsWithUsers"], context?.previousDepsWithUsers)
      handleErrorSession(error)
    },
  })
}
