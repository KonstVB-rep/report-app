import { DealType } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";

import { useState } from "react";

import { FilePenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import TooltipComponent from "@/shared/ui/TooltipComponent";

import EditProject from "./EditProject";
import EditRetail from "./EditRetail";

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
          <EditProject close={close} id={id} />
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
          <EditRetail close={close} id={id} />
        </Dialog>
      );
    default:
      return null;
  }
};

export default EditDealButtonIcon;
