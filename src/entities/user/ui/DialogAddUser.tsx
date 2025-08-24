"use client";

import { PermissionEnum } from "@prisma/client";

import React from "react";

import dynamic from "next/dynamic";

import { SquarePlus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";
import ProtectedByPermissions from "@/shared/custom-components/ui/Protect/ProtectedByPermissions";

import UserCreateFormCopy from "./UserCreateForm_copy";
import UserFormSkeleton from "./UserFormSkeleton";
import { cn } from "@/shared/lib/utils";

const UserCreateForm = dynamic(() => import("./UserCreateForm"), {
  ssr: false,
  loading: () => <UserFormSkeleton />,
});

const DialogAddUser = ({ className }: { className?: string}) => {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.USER_MANAGEMENT]}>
      <DialogComponent
        trigger={
          <Button
            variant="outline"
            className={cn("btn_hover",className)}
            aria-label="Добавить нового пользователя"
          >
            <SquarePlus size={16} />
            <span className="whitespace-nowrap text-sm text-start">
              Добавить пользователя
            </span>
          </Button>
        }
        dialogTitle="Форма добавления пользователя"
        classNameContent="sm:max-w-[600px]"
      >
        {/* <UserCreateForm /> */}
        <UserCreateFormCopy />
      </DialogComponent>
    </ProtectedByPermissions>
  );
};

export default DialogAddUser;
