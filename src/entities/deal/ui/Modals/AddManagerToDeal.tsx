import React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getManagers } from "@/entities/department/lib/utils";
import DialogComponent from "@/shared/ui/DialogComponent";
import { cn } from "@/shared/lib/utils";

const managers = getManagers();

const AddManagerToDeal = () => {
  return (
    <DialogComponent
      trigger={
        <Button
          variant="outline"
          aria-label="Добавить менеджера"
          className="ml-auto"
        >
          Добавить менеджера
        </Button>
      }
      classNameContent="max-w-fit sm:max-w-fit"
    >
      <div className="flex max-w-fit flex-col gap-3">
        {Object.entries(managers).map(([id, name], index) => {
          const isMiddleElement = index !== 0 || index !== Object.entries(managers).length - 1
          return (
            <div className={cn("flex items-center gap-3", isMiddleElement && "border-b pb-2")} key={id}>
              <Checkbox id={id} className="h-4 w-4 cursor-pointer" />
              <Label htmlFor={id} className="capitalize cursor-pointer text-base font-normal">
                {name}
              </Label>
            </div>
          );
        })}
      </div>
    </DialogComponent>
  );
};

export default AddManagerToDeal;
