"use client";

import { PermissionEnum } from "@prisma/client";

import { useParams } from "next/navigation";

import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Overlay from "@/shared/ui/Overlay";

import { useDeleteUser } from "../hooks/mutate";
import { useGetUser } from "../hooks/query";

const DialogDeleteUser = () => {
  const params = useParams();
  const userId = String(params.userId);

  const { data } = useGetUser(userId, [PermissionEnum.USER_MANAGEMENT]);

  const { mutate, isPending } = useDeleteUser(userId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex h-10 w-full items-center justify-start gap-2 border-none px-2 hover:bg-red-600/70 hover:text-white focus-visible:bg-red-600/70 focus-visible:text-white"
        >
          <Trash /> Удалить профиль
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" showX={false}>
        <DialogHeader>
          <DialogTitle className="sr-only">Удалить пользователя</DialogTitle>

          <DialogDescription className="sr-only">
            Пользователь будет удален навсегда
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-4">
          <Overlay isPending={isPending} />
          <p className="text-center">Вы уверены что хотите удалить аккаунт?</p>
          <p className="grid text-center">
            <span> Пользователь: </span>
            <span className="text-lg font-bold capitalize">
              {data?.username.split(" ").join(" ")}
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
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteUser;
