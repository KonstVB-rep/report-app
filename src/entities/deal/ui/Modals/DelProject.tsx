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
import SubmitFormButton from "../../../../shared/ui/Buttons/SubmitFormButton";
import { useDelDeal, useGetDealById } from "@/entities/deal/hooks";
import { DealType } from "@prisma/client";

const DelDeal = ({
  close,
  id,
  type,
}: {
  close: Dispatch<SetStateAction<null>>;
  id: string;
  type: DealType;
}) => {
  const { data: deal } = useGetDealById(id, type);
  const { mutate: delDeal, isPending } = useDelDeal(close, type);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Удалить проект</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <p>Вы точно уверены что хотите удалить сделку</p>
        <p className="font-bold text-xl text-center py-2 px-4 bg-muted rounded-xl">
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

export default DelDeal;
