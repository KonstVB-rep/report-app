import { getQueryClient } from "@/app/provider/query-provider";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { createUser, deleteUser } from "../api";
import { userSchema } from "../model/schema";
import {
  UserRequest,
  DepartmentTypeName,
  RoleType,
  PermissionType,
} from "../types";
import { useRouter } from "next/navigation";
import { TOAST } from "../ui/Toast";

const queryClient = getQueryClient();

export const useCreateUser = (setOpen: Dispatch<SetStateAction<boolean>>) => {
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
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["depsWithUsers"],
      });
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};

export const useDeleteUser = (userId: string) => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
      router.push("/");
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["user", userId],
          exact: true,
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["depsWithUsers"],
        exact: true,
      });
    },
    onError: (error) => {
      TOAST.ERROR((error as Error).message);
    },
  });
};
