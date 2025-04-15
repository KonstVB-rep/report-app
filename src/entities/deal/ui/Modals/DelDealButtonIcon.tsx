import { DealType } from "@prisma/client";

import React from "react";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useGetDealById } from "@/entities/deal/hooks/query";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import DialogComponent from "@/shared/ui/DialogComponent";

import { useDelDeal } from "../../hooks/mutate";

const DelDealButtonIcon = ({ id, type }: { id: string; type: DealType }) => {
  const { data: deal } = useGetDealById(id, type);

  const [open, setOpen] = React.useState(false);

  const { mutate: delDeal, isPending } = useDelDeal(
    () => setOpen(false),
    type,
    deal?.userId as string
  );

  return (
    <DialogComponent
      open={open}
      onOpenChange={setOpen}
      dialogTitle="Удалить сделку"
      contentTooltip="Удалить"
      classNameContent="sm:max-w-[400px]"
      trigger={
        <Button size="icon" variant={"destructive"}>
          <Trash2 />
        </Button>
      }
      footer={
        <DialogFooter className="grid grid-cols-2 gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Передумал
            </Button>
          </DialogClose>
          <SubmitFormButton
            type="submit"
            isPending={isPending}
            onClick={() => delDeal(id)}
            title="Удалить"
          />
        </DialogFooter>
      }
    >
      <div className="grid gap-4 py-4">
        <p>Вы точно уверены что хотите удалить сделку</p>
        <p className="rounded-xl bg-muted px-4 py-2 text-center text-xl font-bold">
          &quot;{deal?.nameObject}&quot;?
        </p>
        <p>Его нельзя будет восстановить!</p>
      </div>
    </DialogComponent>
  );
};

export default DelDealButtonIcon;
