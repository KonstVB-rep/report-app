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
      <DialogTrigger className="btn_hover text-sm">
        {icon}
        <span className="whitespace-nowrap">{textTrigger}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogClose className="absolute right-3 top-3 p-[2px] hover:rounded-full hover:bg-muted">
          <X />
        </DialogClose>
        <DialogDescription className="sr-only">{title}</DialogDescription>
        <DialogHeader>
          <DialogTitle className="border-none text-center text-sm uppercase">
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
