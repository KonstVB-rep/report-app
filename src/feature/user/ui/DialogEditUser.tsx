"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import { UserPen } from "lucide-react";

import { UserOmit, UserWithdepartmentName } from "@/entities/user/types";
import UserFormSkeleton from "@/entities/user/ui/UserFormSkeleton";
import { useGetUser } from "@/feature/user/hooks/query";
import EditDataDialog from "@/shared/custom-components/ui/EditDialog";
import { TOAST } from "@/shared/custom-components/ui/Toast";

const UserEditForm = dynamic(() => import("@/feature/user/ui/UserEditForm"), {
  ssr: false,
  loading: () => <UserFormSkeleton />,
});

const DialogEditUser = ({
  user,
  textButtonShow = false,
  className,
}: {
  user: UserOmit;
  textButtonShow?: boolean;
  className?: string;
}) => {
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
    <EditDataDialog
      textButtonShow={textButtonShow}
      title="Редактировать пользователя"
      open={open}
      setOpen={setOpen}
      icon={<UserPen size={40} />}
      className={className}
    >
      {isLoading ? (
        <UserFormSkeleton />
      ) : (
        <UserEditForm user={data as UserWithdepartmentName} setOpen={setOpen} />
      )}
    </EditDataDialog>
  );
};

export default DialogEditUser;
