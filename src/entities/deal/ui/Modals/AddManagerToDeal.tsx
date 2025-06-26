import React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getManagers } from "@/entities/department/lib/utils";
import { cn } from "@/shared/lib/utils";
import DialogComponent from "@/shared/ui/DialogComponent";

import { Crown } from "lucide-react";

const managersList = getManagers();

const AddManagerToDeal = ({
  managers,
  setManagers,
  firstManager,
  setFirstManager
}: {
  managers: { userId: string }[];
  setManagers: React.Dispatch<React.SetStateAction<{ userId: string }[]>>;
  firstManager: string;
  setFirstManager: React.Dispatch<React.SetStateAction<string>>;
}) => {

  const handleChange = (value: { userId: string }) => {
    setManagers((prevManagers) => {
      const isSelected = prevManagers.some(user => user.userId === value.userId);

      return isSelected
        ? prevManagers.filter(manager => manager.userId !== value.userId)
        : [...prevManagers, value];
    });
  };

  const handleValueChange = (value: string) => {
    // Если выбранный менеджер уже ответственный - ничего не делаем
    if (value === firstManager) return;
    
    setManagers(prev => {
      // Если новый ответственный менеджер ещё не в списке - добавляем
      if (!prev.some(m => m.userId === value)) {
        return [...prev, { userId: value }];
      }
      return prev;
    });
    
    // Обновляем ответственного менеджера
    setFirstManager(value);
  };

  return (
    <DialogComponent
      trigger={
        <Button
          variant="outline"
          aria-label="Добавить менеджера"
          className="ml-auto"
          type="button"
        >
          Добавить менеджера
        </Button>
      }
      classNameContent="max-w-fit sm:max-w-fit"
    >
      <div className="flex">
        <div className="flex flex-col gap-1 h-full">
          <RadioGroup 
            value={firstManager}
            className="pt-6 gap-1" 
            onValueChange={handleValueChange}
          >
            {Object.entries(managersList).map(([id]) => (
              <div
                className="group flex items-center gap-3 rounded-md hover:bg-muted p-3 mb-1"
                key={id}
              >
                <Label>
                  <Crown className={cn(
                    "h-6 w-6 cursor-pointer transform duration-150", 
                    id === firstManager ? "fill-amber-500 scale-125" : "opacity-50"
                  )}/>
                  <RadioGroupItem 
                    value={id} 
                    id={id} 
                    className="h-6 w-6 hidden" 
                    title="Сделать ответственным" 
                  />
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex max-w-fit flex-col gap-1 pr-6 pt-6">
          {Object.entries(managersList).map(([id, name]) => {
            const isChecked = managers.some(m => m.userId === id);
            
            return (
              <div
                className="group flex items-center gap-3 rounded-md hover:bg-muted p-3 mb-1"
                key={id}
              >
                <Checkbox
                  id={`${id}_${name}`}
                  className="h-6 w-6 cursor-pointer transform duration-150 border-primary group-hover:scale-120 group-focus-visible:scale-120 group-hover:border-2 group-focus-visible:border-2 active:scale-95"
                  checked={isChecked}
                  onCheckedChange={() => handleChange({ userId: id })}
                  disabled={id === firstManager} // Делаем чекбокс ответственного менеджера недоступным
                />
                <Label
                  htmlFor={`${id}_${name}`}
                  className="capitalize cursor-pointer text-base font-normal"
                >
                  {name}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </DialogComponent>
  );
};

export default AddManagerToDeal;