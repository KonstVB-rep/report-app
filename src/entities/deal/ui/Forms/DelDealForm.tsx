import React, { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import Overlay from "@/shared/ui/Overlay";
import { useGetDealById } from "../../hooks/query";
import { useDelDeal } from "../../hooks/mutate";
import { DealType } from "@prisma/client";
import { useDeleteFiles } from "@/widgets/Files/hooks/mutate";

type Props = {
  id: string;
  type: DealType;
  close: Dispatch<SetStateAction<void>>;
};

const DelDealForm =({
  id,
  type,
  close
}: Props) => {
    const { data: deal } = useGetDealById(id, type);

    const { mutate: delDeal, isPending } = useDelDeal(
      () => {
        if (!deal?.dealFiles?.length) {
          close();
          return;
        }
  
        mutate(deal.dealFiles);
      },
      type,
      deal?.userId ?? ""
    );
  
    const { mutate, isPending: isPendingDelete } = useDeleteFiles(() =>
      close
    );
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      delDeal(id);
    };

  return (
    <div>
      <Overlay isPending={isPending || isPendingDelete} />
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
    </div>
  );
};

export default DelDealForm;
