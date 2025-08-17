"use client";

import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { UserPen } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";
import { TOAST } from "@/shared/custom-components/ui/Toast";

import { useGetUser } from "../hooks/query";
import { UserWithdepartmentName } from "../types";
import UserFormSkeleton from "./UserFormSkeleton";

const UserEditForm = dynamic(() => import("./UserEditForm"), {
  ssr: false,
  loading: () => <UserFormSkeleton />,
});

const DialogEditUser = () => {
  const params = useParams();
  const userId = String(params.userId);

  const { data, isLoading, isError } = useGetUser(userId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isError) {
      TOAST.ERROR("Ошибка при загрузке данных пользователя");
      console.error("Ошибка при загрузке данных пользователя");
    }
  }, [isError]);

  if (!userId) return null;

  return (
    <DialogComponent
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant="outline"
          aria-label="Редактировать пользователя"
          className="h-10 w-full border-none px-2 btn_hover"
        >
          <UserPen />
          <span className="whitespace-nowrap text-sm">
            Редактировать пользователя
          </span>
        </Button>
      }
      dialogTitle={"Форма редактирования пользователя"}
      classNameContent="sm:max-w-[600px]"
    >
      {/* Если данные загружаются или произошла ошибка */}
      {isLoading ? (
        <UserFormSkeleton />
      ) : (
        <UserEditForm user={data as UserWithdepartmentName} setOpen={setOpen} />
      )}
    </DialogComponent>
  );
};

export default DialogEditUser;
