import React, { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import MotionDivY from "@/shared/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/ui/Overlay";

import { useGetOrderById } from "../hooks/query";
import { useDelOrder } from "../hooks/mutate";
import DelDealSkeleton from "@/entities/deal/ui/Skeletons/DelDealSkeleton";

type Props = {
  id: string;
  close: Dispatch<SetStateAction<void>>;
};

const DelOrderForm = ({ id, close }: Props) => {
  const { data: order } = useGetOrderById(id);

  const { mutate: delDeal, isPending } = useDelOrder(close)

  const isLoading = isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    delDeal(id);
  };

  if (isLoading) return <DelDealSkeleton />;

  return (
    <MotionDivY>
      <Overlay isPending={isLoading} />
      <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
        <p className="text-center">
          Вы точно уверены что хотите удалить данные
        </p>
        <p className="rounded-xl bg-muted px-4 py-2 text-center text-xl font-bold">
          &quot;{order?.nameDeal}&quot;?
        </p>
        <p className="text-center">Их нельзя будет восстановить!</p>
        <div className="grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Отмена
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

export default DelOrderForm;
