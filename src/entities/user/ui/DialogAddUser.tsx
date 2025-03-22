"use client";
import React, { Dispatch, SetStateAction } from "react";
import { SquarePlus } from "lucide-react";
import dynamic from "next/dynamic"; // Динамический импорт
import ProtectedByPermissions from "@/shared/ui/ProtectedByPermissions";
import { PermissionEnum } from "@prisma/client";

const DialogForm = dynamic(() => import("./DialogForm"), { ssr: false });
const UserCreateForm = dynamic(() => import("./UserCreateForm"), {
  ssr: false,
});

const DialogAddUser = () => {
  return (
    <ProtectedByPermissions permissionArr={[PermissionEnum.USER_MANAGEMENT]}>
      <DialogForm
        icon={<SquarePlus size={16} />}
        renderItem={(setOpen: Dispatch<SetStateAction<boolean>>) => (
          <UserCreateForm setOpen={setOpen} />
        )}
        textTrigger="Добавить пользователя"
        title={"Форма добавления пользователя"}
      />
    </ProtectedByPermissions>
  );
};

export default DialogAddUser;
