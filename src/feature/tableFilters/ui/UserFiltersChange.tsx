import { Button } from "@/components/ui/button";

import DialogComponent from "@/shared/ui/DialogComponent";
import { FilePen } from "lucide-react";
import React from "react";
import TabsChangeFilter from "./TabsChangeFilter";

const UserFiltersChange = ({ filterId }: { filterId: string }) => {
  return (
    <DialogComponent
      dialogTitle=""
      contentTooltip="Удалить/обновить фильтр"
      trigger={
        <Button variant={"secondary"} size={"icon"} className="btn_hover w-fit">
          <FilePen />
        </Button>
      }
      classNameContent="w-fit z-50"
    >
      <TabsChangeFilter filterId={filterId} />
    </DialogComponent>
  );
};

export default UserFiltersChange;
