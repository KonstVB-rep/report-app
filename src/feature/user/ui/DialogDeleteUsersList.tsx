"use client";

import { UserOmit } from "@/entities/user/types";
import { useDeleteUser, useDeleteUsersList } from "@/feature/user/hooks/mutate";
import { useGetUser } from "@/feature/user/hooks/query";
import DeleteDialog from "@/shared/custom-components/ui/DeleteDIalog";

const DialogDeleteUsersList = ({
  users,
  textButtonShow = false,
  className,
}: {
  users: UserOmit[];
  textButtonShow?: boolean;
  className?: string;
}) => {
  const dataUsers = users.map((user) => user.id);
  const { mutate, isPending } = useDeleteUsersList(dataUsers);

  return (
    <>
      <DeleteDialog
        textButtonShow={textButtonShow}
        title="Удалить список"
        description="Вы действительно хотите удалить пользователей?"
        isPending={isPending}
        mutate={mutate}
        className={className}
      >
        <>
          <p className="text-center">Вы уверены что хотите удалить аккаунты?</p>
          <div className="grid text-center relative">
            <div> Пользователей: </div>
            <ol className="text-md list-decimal font-semibold capitalize max-h-60 overflow-y-auto grid gap-1 p-2 bg-black/10 dark:bg-black rounded">
              {users.map((user, index) => (
                <li
                  key={user.id}
                  className="flex items-center justify-start gap-2"
                >
                  <span>{index + 1}. </span>
                  {user.username}
                </li>
              ))}
            </ol>
            <span>будут удалены безвозвратно</span>
          </div>
        </>
      </DeleteDialog>
    </>
  );
};

export default DialogDeleteUsersList;
