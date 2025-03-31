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
  const hiddenColumns = Object.entries(data.getState().columnVisibility)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, isVisible]) => !isVisible)
    .map(([col]) => col);

  const handleResetVisibility = () => {
    data.setColumnVisibility(
      Object.fromEntries(data.getAllColumns().map((col) => [col.id, true]))
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className={`${
          hiddenColumns.length - 1 > 0 ? "border-solid" : "border-dashed"
        } border-muted-foreground`}
      >
        <Button
          variant="outline"
          title="Visibility columns"
          className="relative flex gap-1"
        >
          <ListChecks />
          {hiddenColumns.length - 1 > 0 && (
            <span className="absolute right-0 top-0 inline-flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-primary bg-blue-700 text-xs font-medium text-white">
              {hiddenColumns.length }
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
              .filter((col) => col.getCanHide() && col.id !== "user")
              .map((col) => (
                <div key={col.id} className="flex items-center gap-1">
                  <Checkbox
                    id={col.id}
                    checked={data.getState().columnVisibility[col.id] ?? true}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  />
                  <label htmlFor={col.id} className="cursor-pointer">
                    {col.columnDef.header as string}
                  </label>
                </div>
              ))}
          </div>
          {hiddenColumns.length - 1 > 0 && (
            <Button
              onClick={handleResetVisibility}
              variant="outline"
              className="btn_hover w-full text-xs"
            >
              Очистить фильтр
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SelectColumns;
