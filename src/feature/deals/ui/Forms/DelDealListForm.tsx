import { DealFile, DealType } from "@prisma/client";

import React, { Dispatch, SetStateAction } from "react";

import { DeletingDealsListItem } from "@/entities/deal/types";
import { Button } from "@/shared/components/ui/button";
import { DialogClose } from "@/shared/components/ui/dialog";
import SubmitFormButton from "@/shared/custom-components/ui/Buttons/SubmitFormButton";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/custom-components/ui/Overlay";
import { useDeleteFiles } from "@/widgets/Files/hooks/mutate";

import { useDelListDeal } from "../../api/hooks/mutate";

type Props = {
  deals: DeletingDealsListItem[];
  close: Dispatch<SetStateAction<void>>;
};

const DelDealListForm = ({ deals, close }: Props) => {
  const { mutate: delDeals, isPending } = useDelListDeal(
    (dataFiles: DealFile[]) => {
      if (!dataFiles) {
        close();
        return;
      }

      mutate(dataFiles);
    }
  );

  const { mutate, isPending: isPendingDelete } = useDeleteFiles(() => close);

  const isLoading = isPending || isPendingDelete;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    delDeals(deals);
  };

  return (
    <MotionDivY>
      <Overlay isPending={isLoading} />
      <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
        <p className="text-center">
          Вы точно уверены что хотите удалить данные
        </p>
        <p className="rounded-xl bg-muted px-4 py-2 text-center text-xl font-bold break-all max-h-60 overflow-y-auto">
          {deals.map((deal) => (
            <> &quot;{deal?.title}&quot;?</>
          ))}
        </p>
        <p className="text-center">Их нельзя будет восстановить!</p>
        <div className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отменить
            </Button>
          </DialogClose>
          <SubmitFormButton
            type="submit"
            isPending={isLoading}
            title="Удалить"
          />
        </div>
      </form>
    </MotionDivY>
  );
};

export default DelDealListForm;
