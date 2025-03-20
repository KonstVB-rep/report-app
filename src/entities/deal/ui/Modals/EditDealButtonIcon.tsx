import { DealType } from "@prisma/client";

import EditRetail from "./EditRetail";
import EditProject from "./EditProject";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { FilePenLine } from "lucide-react";
import { useState } from "react";

const EditDealButtonIcon = ({ id, type }: { id: string; type: DealType }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);


    switch (type) {
      case DealType.PROJECT:
        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
                <Button size="icon" variant={"outline"} title="Редактировать">
                  <FilePenLine />
                </Button>
            </DialogTrigger>
            <EditProject close={close} id={id} />
          </Dialog>
        );
      case DealType.RETAIL:
        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
                <Button size="icon" variant={"outline"} title="Удалить">
                  <FilePenLine />
                </Button>
            </DialogTrigger>
            <EditRetail close={close} id={id} />
          </Dialog>
        );
      default:
        return null;
    }
};

export default EditDealButtonIcon;
