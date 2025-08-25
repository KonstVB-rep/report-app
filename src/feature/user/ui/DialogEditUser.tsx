"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import { UserPen } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";
import { TOAST } from "@/shared/custom-components/ui/Toast";

import {  UserOmit, UserWithdepartmentName } from "@/entities/user/types";
import UserFormSkeleton from "@/entities/user/ui/UserFormSkeleton";
import { useGetUser } from "@/feature/user/hooks/query";

const UserEditForm = dynamic(() => import("@/feature/user/ui/UserEditForm"), {
  ssr: false,
  loading: () => <UserFormSkeleton />,
});

const DialogEditUser = ({ user }: { user: UserOmit }) => {

  const { data, isLoading, isError } = useGetUser(user.id);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isError) {
      TOAST.ERROR("Ошибка при загрузке данных пользователя");
      console.error("Ошибка при загрузке данных пользователя");
    }
  }, [isError]);

  if (!user.id) return null;

  return (
    <DialogComponent
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant="outline"
          aria-label="Редактировать пользователя"
          title="Редактировать пользователя"
          className="h-10 w-10 border-none px-2 btn_hover justify-center flex-shrink-0"
        >
          <UserPen size={40}/>
        </Button>
      }
      dialogTitle={"Форма редактирования пользователя"}
      classNameContent="sm:max-w-[600px]"
    >
      {isLoading ? (
        <UserFormSkeleton />
      ) : (
        <UserEditForm user={data as UserWithdepartmentName} setOpen={setOpen} />
      )}
    </DialogComponent>
  );
};

export default DialogEditUser;
