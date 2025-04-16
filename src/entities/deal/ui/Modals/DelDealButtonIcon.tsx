import { DealType } from "@prisma/client";

import React from "react";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useGetDealById } from "@/entities/deal/hooks/query";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import DialogComponent from "@/shared/ui/DialogComponent";
import { useDeleteFiles } from "@/widgets/Files/hooks/mutate";

import { useDelDeal } from "../../hooks/mutate";

const DelDealButtonIcon = ({ id, type }: { id: string; type: DealType }) => {
  const { data: deal } = useGetDealById(id, type);

  const [open, setOpen] = React.useState(false);

  const { mutate: delDeal, isPending } = useDelDeal(
    () => {
      if (!deal?.dealFiles?.length) {
        setOpen(false);
        return;
      }

      mutate(deal.dealFiles);
    },
    type,
    deal?.userId ?? ""
  );

  const { mutate, isPending: isPendingDelete } = useDeleteFiles(() =>
    setOpen(false)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    delDeal(id);
  };

  return (
    <DialogComponent
      open={open}
      onOpenChange={setOpen}
      dialogTitle="Удалить данные"
      contentTooltip="Удалить"
      classNameContent="sm:max-w-[400px]"
      trigger={
        <Button size="icon" variant={"destructive"}>
          <Trash2 />
        </Button>
      }
    >
      <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
        <p>Вы точно уверены что хотите удалить данные</p>
        <p className="rounded-xl bg-muted px-4 py-2 text-center text-xl font-bold">
          &quot;{deal?.nameObject}&quot;?
        </p>
        <p>Их нельзя будет восстановить!</p>
        <div className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Передумал
            </Button>
          </DialogClose>
          <SubmitFormButton
            type="submit"
            isPending={isPending || isPendingDelete}
            title="Удалить"
          />
        </div>
      </form>
    </DialogComponent>
  );
};

export default DelDealButtonIcon;
