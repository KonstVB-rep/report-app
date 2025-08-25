"use client";

import dynamic from "next/dynamic";

import { Trash } from "lucide-react";

import DeleteUserModalContentSkeleton from "@/entities/user/ui/DeleteUserModalContentSkeleton";
import { useDeleteUser } from "@/feature/user/hooks/mutate";
import { useGetUser } from "@/feature/user/hooks/query";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import Overlay from "@/shared/custom-components/ui/Overlay";
import { UserOmit } from "@/entities/user/types";

const DeleteUserModalContent = dynamic(
  () => import("./DeleteUserModalContent"),
  { ssr: false, loading: () => <DeleteUserModalContentSkeleton /> }
);
const DialogDeleteUser = ({ user }: { user: UserOmit }) => {

  const { data, isFetching } = useGetUser(user.id);

  const { mutate, isPending } = useDeleteUser(user.id);

  return (
    <>
      <Overlay isPending={isPending} />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            aria-label={`Удалить пользователя ${user.username}`}
            title="Удалить пользователя"
            className="flex h-10 w-10 items-center flex-shrink-0 justify-center gap-2 border-none px-2 hover:bg-red-600/70 hover:text-white focus-visible:bg-red-600/70 focus-visible:text-white"
          >
            <Trash size={40} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" showX={false}>
          <DialogHeader>
            <DialogTitle className="sr-only">Удалить пользователя</DialogTitle>

            <DialogDescription className="sr-only">
              Пользователь будет удален навсегда
            </DialogDescription>
          </DialogHeader>
          {isFetching || !data ? (
            <DeleteUserModalContentSkeleton />
          ) : (
            <DeleteUserModalContent
              mutate={mutate}
              isPending={isPending}
              username={data.username}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogDeleteUser;
