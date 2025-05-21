import React from "react";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";

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
  return (
    <MotionDivY>
      <DialogHeader>
        <DialogTitle className="sr-only">Удалить пользователя</DialogTitle>

        <DialogDescription className="sr-only">
          Пользователь будет удален навсегда
        </DialogDescription>
      </DialogHeader>
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
          <Button onClick={() => mutate()} className="flex-1">
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
