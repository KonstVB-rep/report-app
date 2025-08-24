"use client";

import React, { useRef } from "react";

import { useParams, useSearchParams } from "next/navigation";

import { Save } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { DialogClose } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";

import { useSaveFilter } from "../hooks/mutate";

const SaveFilter = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { userId } = useParams();

  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);

  const { mutate, isPending } = useSaveFilter(() => setOpen(false));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      mutate({
        ownerId: userId as string,
        data: {
          filterName: inputRef.current.value,
          filterValue: searchParams.toString(),
          isActive: false,
        },
      });
    }
  };

  return (
    <DialogComponent
      dialogTitle="Сохранить фильтр"
      contentTooltip="Сохранить фильтр"
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant={"secondary"} size={"icon"} className="btn_hover w-fit">
          <Save />
        </Button>
      }
      classNameContent="w-[400px] z-50"
    >
      <form action="" className="grid gap-5" onSubmit={handleSubmit}>
        <Label>
          <Input placeholder="Название фильтра" ref={inputRef} />
        </Label>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Не сохранять
            </Button>
          </DialogClose>
          <SubmitFormButton
            title="Сохранить"
            disabled={isPending}
            isPending={isPending}
          />
        </div>
      </form>
    </DialogComponent>
  );
};

export default SaveFilter;
