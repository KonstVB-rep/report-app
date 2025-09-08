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
import { cn } from "@/shared/lib/utils";

import Overlay from "../Overlay";
import DeleteModalContentSkeleton from "../Skeletons/DeleteModalContentSkeleton";
import DeleteModalContent from "./DeleteModalContent";

type DeleteDialogProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  isPending: boolean;
  isShowSkeleton?: boolean;
  textButtonShow?: boolean;
  mutate: () => void;
  className?: string;
};

const DeleteDialog = ({
  title,
  description,
  children,
  isPending,
  isShowSkeleton = false,
  textButtonShow = false,
  mutate,
  className = "flex items-center flex-shrink-0 gap-2 border-none px-2 hover:bg-red-600/70 hover:text-white focus-visible:bg-red-600/70 focus-visible:text-white",
}: DeleteDialogProps) => {
  return (
    <>
      <Overlay isPending={isPending} />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            title={title}
            size={!textButtonShow ? "icon" : "default"}
            className={cn(
              className,
              textButtonShow ? "w-full justify-start" : "justify-center"
            )}
          >
            <Trash size={40} />
            {textButtonShow && title}
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
