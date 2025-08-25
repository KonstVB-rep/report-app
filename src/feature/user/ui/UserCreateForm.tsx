"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import Overlay from "@/shared/custom-components/ui/Overlay";
import { ActionResponse } from "@/shared/types";

import { UserFormData } from "../../../entities/user/types";
import UserForm from "../../../entities/user/ui/UserForm";
import { useCreateUser } from "../hooks/mutate";

const initialState: ActionResponse<UserFormData> = {
  success: false,
  message: "",
};

const UserCreateForm = () => {
  const [state, setState] = useState(initialState);

  const { mutateAsync, isPending } = useCreateUser(
    (data: ActionResponse<UserFormData>) => {
      setState(data);
    }
  );


  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    mutateAsync(formData);
  };

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

export default UserCreateForm;
