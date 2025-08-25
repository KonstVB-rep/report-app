import React from "react";

import { Trash } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

import Overlay from "../Overlay";
import DeleteModalContentSkeleton from "../Skeletons/DeleteModalContentSkeleton";
import DeleteModalContent from "./DeleteModalContent";

type DeleteDialogProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  isPending: boolean;
  isShowSkeleton?: boolean;
  mutate: () => void;
};

const DeleteDialog = ({
  title,
  description,
  children,
  isPending,
  isShowSkeleton = false,
  mutate,
}: DeleteDialogProps) => {
  return (
    <>
      <Overlay isPending={isPending} />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            title={title}
            className="flex h-10 w-10 items-center flex-shrink-0 justify-center gap-2 border-none px-2 hover:bg-red-600/70 hover:text-white focus-visible:bg-red-600/70 focus-visible:text-white"
          >
            <Trash size={40} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" showX={false}>
          <DialogHeader>
            <DialogTitle className="sr-only">{title}</DialogTitle>

            <DialogDescription className="sr-only">
              {description}
            </DialogDescription>
          </DialogHeader>
          {isShowSkeleton ? (
            <DeleteModalContentSkeleton />
          ) : (
            <DeleteModalContent mutate={mutate} isPending={isPending}>
              {children}
            </DeleteModalContent>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteDialog;
