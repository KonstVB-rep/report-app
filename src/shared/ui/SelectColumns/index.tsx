import React, { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface SelectColumnsProps<TData> {
  data: Table<TData>;
}
const SelectColumns = <TData,>({ data }: SelectColumnsProps<TData>) => {
  const [open, setOpen] = useState(false);
  const hiddenColumnsCount = data
    .getAllColumns()
    .filter((column) => column.getCanHide() && !column.getIsVisible()).length;

  const handleResetVisibility = () => {
    data
      .getAllColumns()
      .filter((column) => column.getCanHide())
      .forEach((column) => column.toggleVisibility(true));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onClick={() => setOpen(!open)}
        className={`${
          hiddenColumnsCount ? "border-solid" : "border-dashed"
        } border-muted-foreground`}
      >
        <Button
          variant="outline"
          title="Visibility columns"
          className="flex gap-1 relative"
        >
          <ListChecks />
          {hiddenColumnsCount > 0 && (
            <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 h-4 w-4 inline-flex items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {hiddenColumnsCount}
            </span>
          )}
          {"Колонки показать/скрыть"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit px-1 pb-2">
        <div className="grid gap-4">
          <div className="grid grid-cols-1 items-center gap-1">
            {data
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <div
                  key={column.id}
                  className="flex items-center gap-1 text-sm w-fit px-1"
                >
                  <Checkbox
                    id={column.id}
                    checked={!column.getIsVisible()}
                    onCheckedChange={(value: boolean) =>
                      column.toggleVisibility(!!value)
                    }
                  />
                  <label
                    htmlFor={column.id}
                    className="whitespace-nowrap cursor-pointer"
                  >
                    {column.columnDef.header as string}
                  </label>
                </div>
              ))}
          </div>
          {hiddenColumnsCount > 0 && (
            <Button
              onClick={handleResetVisibility}
              variant={"outline"}
              className="w-full"
            >
              Очистить фильтр
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
    // <DropdownMenu open={open} onOpenChange={setOpen}>
    //   <DropdownMenuTrigger
    //     asChild
    //     onClick={() => setOpen(!open)}
    //     className={`${
    //       hiddenColumnsCount ? "border-solid" : "border-dashed"
    //     } border-muted-foreground`}
    //   >
    //     <Button
    //       variant="outline"
    //       title="Visibility columns"
    //       className="flex gap-1 relative"
    //     >
    //       <ListChecks />
    //       {hiddenColumnsCount > 0 && (
    //         <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 h-4 w-4 inline-flex items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
    //           {hiddenColumnsCount}
    //         </span>
    //       )}
    //       {"Колонки показать/скрыть"}
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end">
    // {data
    //   .getAllColumns()
    //   .filter((column) => column.getCanHide())
    //   .map((column) => {
    //     return (
    //       <DropdownMenuCheckboxItem
    //         key={column.id}
    //         className="capitalize"
    //         checked={column.getIsVisible()}
    //         onCheckedChange={(value: boolean) =>
    //           column.toggleVisibility(!!value)
    //         }
    //         onClick={(e) => e.stopPropagation()}
    //       >
    //         {column.columnDef.header as string}
    //       </DropdownMenuCheckboxItem>
    //     );
    //   })}
    // {hiddenColumnsCount > 0 && (
    //   <Button
    //     onClick={handleResetVisibility}
    //     variant={"outline"}
    //     className="w-full"
    //   >
    //     Очистить фильтр
    //   </Button>
    // )}
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
};

export default SelectColumns;
