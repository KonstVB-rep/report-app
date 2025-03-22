import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction } from "react";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import { useDelDeal, useGetDealById } from "@/entities/deal/hooks";
import { DealType } from "@prisma/client";

const DelDealContextMenu = ({
  close,
  id,
  type,
}: {
  close: Dispatch<SetStateAction<void>>;
  id: string;
  type: DealType;
}) => {
  const { data: deal } = useGetDealById(id, type);
  const { mutate: delDeal, isPending } = useDelDeal(close, type);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Удалить проект</DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <p>Вы точно уверены что хотите удалить сделку</p>
        <p className="rounded-xl bg-muted px-4 py-2 text-center text-xl font-bold">
          &quot;{deal?.nameObject}&quot;?
        </p>
        <p>Его нельзя будет восстановить!</p>
      </div>
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
    </DialogContent>
  );
};

export default DelDealContextMenu;
