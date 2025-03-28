"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DialogComponent from "@/shared/ui/DialogComponent";
import { Save } from "lucide-react";
import React, { useRef } from "react";
import { useSaveFilter } from "../../hooks/mutate";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import { useParams, useSearchParams } from "next/navigation";

const SaveFilter = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {userId} = useParams();

  const searchParams = useSearchParams();

  // Преобразуем параметры в объект
  const params = Object.values(Object.fromEntries(searchParams.entries())).join("&");
  console.log(params);
  
  const { mutate, isPending } = useSaveFilter();

  const handleSubmit = () => {
    if (inputRef.current) {
      mutate({
        data: {
          filterName: inputRef.current.value,
          filterValue: params,
          isActive: false,
        },
        ownerId: userId as string,
      });
    }
  };

  return (
    <DialogComponent
      dialogTitle="Сохранить фильтр"
      contentTooltip="Сохранить фильтр"
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
            type="submit"
            disabled={isPending}
            isPending={isPending}
          />
        </div>
      </form>
    </DialogComponent>
  );
};

export default SaveFilter;
