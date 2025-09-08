import React from "react";

import { Button } from "@/shared/components/ui/button";
import { DialogClose } from "@/shared/components/ui/dialog";
import MotionDivY from "@/shared/custom-components/ui/MotionComponents/MotionDivY";
import Overlay from "@/shared/custom-components/ui/Overlay";

type DeleteModalContentProps = {
  mutate: () => void;
  isPending?: boolean;
  children?: React.ReactNode;
};

const DeleteModalContent = ({
  mutate,
  isPending,
  children,
}: DeleteModalContentProps) => {
  const deleteData = async () => {
    mutate();
  };
  return (
    <MotionDivY>
      <div className="grid gap-5">
        <Overlay isPending={isPending || false} />
        {children}
        <div className="flex justify-between gap-4">
          <Button onClick={deleteData} className="flex-1">
            {isPending ? "Удаление..." : "Удалить"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="flex-1">
              Отмена
            </Button>
          </DialogClose>
        </div>
      </div>
    </MotionDivY>
  );
};

export default DeleteModalContent;
