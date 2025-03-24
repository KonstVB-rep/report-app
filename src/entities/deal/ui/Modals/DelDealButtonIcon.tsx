import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import SubmitFormButton from "@/shared/ui/Buttons/SubmitFormButton";
import { useDelDeal, useGetDealById } from "@/entities/deal/hooks";
import { DealType } from "@prisma/client";
import { Trash2 } from "lucide-react";
import TooltipComponent from "@/shared/ui/TooltipComponent";

const DelDealButtonIcon = ({ id, type }: { id: string; type: DealType }) => {
  const { data: deal } = useGetDealById(id, type);
  const [open, setOpen] = React.useState(false);
  const { mutate: delDeal, isPending } = useDelDeal(close, type);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipComponent content="Удалить">
        <DialogTrigger asChild onClick={() => setOpen(true)}>
          <Button size="icon" variant={"destructive"}>
            <Trash2 />
          </Button>
        </DialogTrigger>
      </TooltipComponent>
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
    </Dialog>
  );
};

export default DelDealButtonIcon;
