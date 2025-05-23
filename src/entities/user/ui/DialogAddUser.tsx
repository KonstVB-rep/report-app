"use client";

import { PermissionEnum } from "@prisma/client";

import React from "react";

import dynamic from "next/dynamic";

import { SquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import DialogComponent from "@/shared/ui/DialogComponent";
import ProtectedByPermissions from "@/shared/ui/Protect/ProtectedByPermissions";

import UserFormSkeleton from "./UserFormSkeleton";

const UserCreateForm = dynamic(() => import("./UserCreateForm"), {
  ssr: false,
  loading: () => <UserFormSkeleton />,
});

const DialogAddUser = () => {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.USER_MANAGEMENT]}>
      <DialogComponent
        trigger={
          <Button variant={"outline"} className="btn_hover w-full">
            <SquarePlus size={16} />
            <span className="whitespace-nowrap text-sm">
              Добавить пользователя
            </span>
          </Button>
        }
        dialogTitle={"Форма добавления пользователя"}
        classNameContent="sm:max-w-[600px]"
      >
        <UserCreateForm />
      </DialogComponent>
    </ProtectedByPermissions>
  );
};

export default DialogAddUser;
