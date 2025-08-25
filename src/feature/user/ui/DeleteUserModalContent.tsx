import React from "react";

import { Button } from "@/shared/components/ui/button";
import { DialogClose } from "@/shared/components/ui/dialog";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/custom-components/ui/Overlay";
import { checkTokens } from "@/shared/lib/helpers/checkTokens";

type DeleteUserModalContentProps = {
  mutate: () => void;
  isPending: boolean;
  username: string | undefined;
};

const DeleteUserModalContent = ({
  mutate,
  isPending,
  username,
}: DeleteUserModalContentProps) => {
  const delUser = async () => {
    await checkTokens();
    mutate();
  };
  return (
    <MotionDivY>
      <div className="grid gap-5">
        <Overlay isPending={isPending} />
        <p className="text-center">Вы уверены что хотите удалить аккаунт?</p>
        <p className="grid text-center">
          <span> Пользователь: </span>
          <span className="text-lg font-bold capitalize">
            {username?.split(" ").join(" ")}
          </span>{" "}
          <span>будет удален безвозвратно</span>
        </p>
        <div className="flex justify-between gap-4">
          <Button onClick={delUser} className="flex-1">
            {isPending ? "Удаление..." : "Удалить"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Отмена
            </Button>
          </DialogClose>
        </div>
      </div>
    </MotionDivY>
  );
};

export default DeleteUserModalContent;
