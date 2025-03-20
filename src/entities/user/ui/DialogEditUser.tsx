"use client";
import React, { Dispatch, SetStateAction } from "react";
import { UserPen } from "lucide-react";
import dynamic from "next/dynamic"; // Динамический импорт
import { getUserShort } from "../api";
import { TOAST } from "./Toast";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { UserWithdepartmentName } from "../types";

const DialogForm = dynamic(() => import("./DialogForm"), { ssr: false });
const UserEditForm = dynamic(() => import("./UserEditForm"), { ssr: false });

const DialogEditUser = () => {
  const params = useParams();
  const userId = String(params.userId);

  const { data, isPending } = useQuery<UserWithdepartmentName | undefined>({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        return (await getUserShort(userId)) as UserWithdepartmentName;
      } catch (error) {
        TOAST.ERROR((error as Error).message);
        throw error;
      }
    },
    enabled: !!userId,
  });

  return (
    <DialogForm
      isLoading={isPending}
      icon={<UserPen size={16} />}
      renderItem={(setOpen: Dispatch<SetStateAction<boolean>>) => (
        <UserEditForm setOpen={setOpen} user={data as UserWithdepartmentName} />
      )}
      textTrigger="Редактировать пользователя"
      title={"Форма редактирования пользователя"}
    />
  );
};

export default DialogEditUser;
