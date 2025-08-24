import React from "react";

import { FilePen } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import DialogComponent from "@/shared/custom-components/ui/DialogComponent";

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
