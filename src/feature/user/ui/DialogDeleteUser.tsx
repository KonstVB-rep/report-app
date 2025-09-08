"use client";

import { UserOmit } from "@/entities/user/types";
import { useDeleteUser } from "@/feature/user/hooks/mutate";
import { useGetUser } from "@/feature/user/hooks/query";
import DeleteDialog from "@/shared/custom-components/ui/DeleteDIalog";

const DialogDeleteUser = ({
  user,
  textButtonShow = false,
}: {
  user: UserOmit;
  textButtonShow?: boolean;
}) => {
  const { data, isFetching } = useGetUser(user.id);

  const { mutate, isPending } = useDeleteUser(user.id);

  return (
    <>
      <DeleteDialog
        textButtonShow={textButtonShow}
        title="Удалить пользователя"
        description="Вы действительно хотите удалить пользователя?"
        isPending={isPending}
        isShowSkeleton={isFetching || !data}
        mutate={mutate}
      >
        <>
          <p className="text-center">Вы уверены что хотите удалить аккаунт?</p>
          <p className="grid text-center">
            <span> Пользователь: </span>
            <span className="text-lg font-bold capitalize">
              {data?.username?.split(" ").join(" ")}
            </span>{" "}
            <span>будет удален безвозвратно</span>
          </p>
        </>
      </DeleteDialog>
    </>
  );
};

export default DialogDeleteUser;
