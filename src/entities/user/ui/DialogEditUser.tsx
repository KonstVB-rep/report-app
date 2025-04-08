"use client";
import React from "react";
import { UserPen } from "lucide-react";
import dynamic from "next/dynamic"; // Динамический импорт
import { useParams } from "next/navigation";
import { UserWithdepartmentName } from "../types";
import { useGetUserShortInfo } from "../hooks/query";
import DialogComponent from "@/shared/ui/DialogComponent";
import { Button } from "@/components/ui/button";
import UserFormSkeleton from "./UserFormSkeleton";

const UserEditForm = dynamic(() => import("./UserEditForm"), { ssr: false , loading: () => <UserFormSkeleton />} );

const DialogEditUser = () => {
  const params = useParams();
  const userId = String(params.userId);

  const { data } = useGetUserShortInfo(userId);
  const [open, setOpen] = React.useState(false);

  return (
    <DialogComponent
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant={"outline"} className="btn_hover">
          <UserPen size={16} />
          <span className="whitespace-nowrap text-sm">Редактировать пользователя</span>
        </Button>
      }
      dialogTitle={"Форма редактирования пользователя"}
      classNameContent="sm:max-w-[600px]"
    >
      <UserEditForm user={data as UserWithdepartmentName} setOpen={setOpen} />
    </DialogComponent>
  );
};

export default DialogEditUser;
