"use client";

import { PermissionEnum } from "@prisma/client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useDeleteUser } from "../hooks/mutate";
import { useGetUser } from "../hooks/query";
import DeleteUserModalContentSkeleton from "./DeleteUserModalContentSkeleton";

const DeleteUserModalContent = dynamic(
  () => import("./DeleteUserModalContent"),
  { ssr: false, loading: () => <DeleteUserModalContentSkeleton /> }
);
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
        <DeleteUserModalContent
          mutate={mutate}
          isPending={isPending}
          username={data?.username}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DialogDeleteUser;
