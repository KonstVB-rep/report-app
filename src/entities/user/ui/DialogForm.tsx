"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Loader, X } from "lucide-react";
import React from "react";

type DialogFormProps = {
  isLoading?: boolean;
  icon: React.ReactNode;
  renderItem: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode;
  textTrigger: string;
  title: string;
};

const DialogForm = ({
  isLoading,
  icon,
  renderItem,
  textTrigger,
  title,
}: DialogFormProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="btn_hover">
        {icon}
        <span className="whitespace-nowrap">{textTrigger}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogClose className="absolute top-3 right-3 hover:bg-muted hover:rounded-full p-[2px]">
          <X />
        </DialogClose>
        <DialogDescription className="sr-only">{title}</DialogDescription>
        <DialogHeader>
          <DialogTitle className="text-sm uppercase text-center border-none">
            {title}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Loader size="100" className="m-auto animate-spin opacity-40" />
        ) : (
          <>{renderItem(setOpen)}</>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
