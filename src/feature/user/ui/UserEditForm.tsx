"use client";

import { DepartmentEnum, PermissionEnum, Role } from "@prisma/client";

import React, { useEffect, useState } from "react";

import { toast } from "sonner";

import {
  UserFormEditData,
  UserWithdepartmentName,
} from "@/entities/user/types";
import UserForm from "@/entities/user/ui/UserForm";
import Overlay from "@/shared/custom-components/ui/Overlay";
import { ActionResponse } from "@/shared/types";

import { useUpdateUser } from "../hooks/mutate";

const initialState: ActionResponse<UserFormEditData> = {
  success: false,
  message: "",
};

const UserEditForm = ({
  user,
  setOpen,
}: {
  user: UserWithdepartmentName | undefined;
  setOpen: (value: boolean) => void;
}) => {
  const [state, setState] = useState(initialState);

  const { mutateAsync, isPending } = useUpdateUser(
    user?.id as string,
    (data: ActionResponse<UserFormEditData>) => {
      setState(data);
      if (data.success) {
        setOpen(false);
      }
    }
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("onSubmit", onSubmit);
    const formData = new FormData(event.currentTarget);
    formData.append("id", user?.id as string);
    state.inputs = {
      username: formData.get("username") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      position: formData.get("position") as string,
      department: formData.get("department") as DepartmentEnum,
      role: formData.get("role") as Role,
      permissions: JSON.parse(
        formData.get("permissions") as string
      ) as PermissionEnum[],
    };
    mutateAsync(formData);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    setState({
      ...initialState,
      inputs: {
        username: user.username,
        phone: user.phone,
        email: user.email,
        position: user.position,
        department: user.departmentName,
        role: user.role,
        permissions: user.permissions,
      },
    });
  }, [user]);

  useEffect(() => {
    let toastId: string | number | null = null;

    if (isPending) {
      toastId = toast.loading("Идет сохранение...");
    } else {
      if (toastId) {
        toast.dismiss(toastId);
      }
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isPending]);

  return (
    <>
      <Overlay isPending={isPending} />
      <UserForm
        state={state}
        onSubmit={onSubmit}
        isPending={isPending}
        setState={setState}
      />
    </>
  );
};
export default UserEditForm;
