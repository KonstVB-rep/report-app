"use client";
import React, { Dispatch, SetStateAction } from "react";
import { SquarePlus } from "lucide-react";
import dynamic from "next/dynamic"; // Динамический импорт
import ProtectedRoute from "@/feature/protected-route";

const DialogForm = dynamic(() => import("./DialogForm"), { ssr: false });
const UserCreateForm = dynamic(() => import("./UserCreateForm"), {
  ssr: false,
});

const DialogAddUser = () => {
  return (
    <ProtectedRoute>
      <DialogForm
        icon={<SquarePlus size={16} />}
        renderItem={(setOpen: Dispatch<SetStateAction<boolean>>) => (
          <UserCreateForm setOpen={setOpen} />
        )}
        textTrigger="Добавить сотрудника"
        title={"Форма добавления сотрудника"}
      />
    </ProtectedRoute>
  );
};

export default DialogAddUser;
