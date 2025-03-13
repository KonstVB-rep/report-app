"use client";
import React, { Dispatch, SetStateAction } from "react";
import { SquarePlus } from "lucide-react";
import dynamic from "next/dynamic"; // Динамический импорт
import Protected from "@/feature/Protected";

const DialogForm = dynamic(() => import("./DialogForm"), { ssr: false });
const UserCreateForm = dynamic(() => import("./UserCreateForm"), {
  ssr: false,
});

const DialogAddUser = () => {
  return (
    <Protected>
      <DialogForm
        icon={<SquarePlus size={16} />}
        renderItem={(setOpen: Dispatch<SetStateAction<boolean>>) => (
          <UserCreateForm setOpen={setOpen} />
        )}
        textTrigger="Добавить сотрудника"
        title={"Форма добавления сотрудника"}
      />
    </Protected>
  );
};

export default DialogAddUser;
