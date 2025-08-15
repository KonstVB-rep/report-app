import { DealType } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";

import { useState } from "react";

import dynamic from "next/dynamic";

import { FilePenLine } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Dialog } from "@/shared/components/ui/dialog";
import TooltipComponent from "@/shared/custom-components/ui/TooltipComponent";

const EditProject = dynamic(() => import("./EditProject"), { ssr: false });
const EditRetail = dynamic(() => import("./EditRetail"), { ssr: false });

const EditDealButtonIcon = ({ id, type }: { id: string; type: DealType }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  switch (type) {
    case DealType.PROJECT:
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <TooltipComponent content="Редактировать">
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <Button size="icon" variant={"outline"} className="btn_hover">
                <FilePenLine />
              </Button>
            </DialogTrigger>
          </TooltipComponent>
          <EditProject
            close={close}
            id={id}
            isInvalidate
            titleForm="Редактировать сделку"
          />
        </Dialog>
      );
    case DealType.RETAIL:
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <TooltipComponent content="Редактировать">
            <DialogTrigger asChild onClick={() => setOpen(true)}>
              <Button size="icon" variant={"outline"} className="btn_hover">
                <FilePenLine />
              </Button>
            </DialogTrigger>
          </TooltipComponent>
          <EditRetail
            close={close}
            id={id}
            isInvalidate
            titleForm="Редактировать проект"
          />
        </Dialog>
      );
    default:
      return null;
  }
};

export default EditDealButtonIcon;
