"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { toast } from "sonner";

import Overlay from "@/shared/custom-components/ui/Overlay";
import { ActionResponse } from "@/shared/types";


import { useUpdateUser } from "../hooks/mutate";
import { UserFormData, UserWithdepartmentName } from "@/entities/user/types";
import UserForm from "@/entities/user/ui/UserForm";

const initialState: ActionResponse<UserFormData> = {
  success: false,
  message: "",
};

const UserEditForm = ({
  user,
  setOpen,
}: {
  user: UserWithdepartmentName | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [state, setState] = useState(initialState);

  const { mutateAsync, isPending } = useUpdateUser(
    user?.id as string,
    (data: ActionResponse<UserFormData>) => {
      setState(data);
      setOpen(false);
      console.log("Изменен пользователь:", data);
    }
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.append("id", user?.id as string);
    mutateAsync(formData);
  };

  console.log(user, "user");

  useEffect(() => {
    if (!user) return;
    setState({
      ...initialState,
      inputs: {
        username: user.username,
        phone: user.phone,
        email: user.email,
        position: user.position,
        department: user.departmentName,
        role: user.role,
        permissions: user.permissions?.join(", "),
      },
    });
  }, [user]);

  useEffect(() => {
    let toastId: string | number | null = null;

    if (isPending) {
      toastId = toast.loading("Идет создание пользователя...");
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
      <UserForm state={state} onSubmit={onSubmit} isPending={isPending} />
    </>
  );
};
export default UserEditForm;
