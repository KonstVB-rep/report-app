import { DealType } from "@prisma/client";

import React, { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";
import { useDeleteFiles } from "@/widgets/Files/hooks/mutate";

import { useDelDeal } from "../../hooks/mutate";
import { useGetDealById } from "../../hooks/query";
import DelDealSkeleton from "../Skeletons/DelDealSkeleton";

type Props = {
  id: string;
  type: DealType;
  close: Dispatch<SetStateAction<void>>;
};

const DelDealForm = ({ id, type, close }: Props) => {
  const { data: deal, isPending: isLoadInfoAboutDeal } = useGetDealById(
    id,
    type
  );

  const userId = deal?.userId ?? "";
  const dealFiles = deal?.dealFiles ?? [];
  const hasFiles = dealFiles.length > 0;

  const { mutate: delDeal, isPending } = useDelDeal(
    () => {
      if (!hasFiles) {
        close();
        return;
      }

      mutate(dealFiles);
    },
    type,
    userId
  );

  const { mutate, isPending: isPendingDelete } = useDeleteFiles(() => close);

  const isLoading = isPending || isPendingDelete;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    delDeal(id);
  };

  if (isLoadInfoAboutDeal) return <DelDealSkeleton />;

  return (
    <MotionDivY>
      <Overlay isPending={isLoading} />
      <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
        <p className="text-center">
          Вы точно уверены что хотите удалить данные
        </p>
        <p className="rounded-xl bg-muted px-4 py-2 text-center text-xl font-bold break-all">
          &quot;{deal?.nameObject}&quot;?
        </p>
        <p className="text-center">Их нельзя будет восстановить!</p>
        <div className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Передумал
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

export default DelDealForm;
