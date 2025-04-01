"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DialogComponent from "@/shared/ui/DialogComponent";
import { Save } from "lucide-react";
import React, { useRef } from "react";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import { useParams, useSearchParams } from "next/navigation";
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
        <Button
          variant={"secondary"}
          size={"icon"}
          className="btn_hover w-full min-w-24"
        >
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
