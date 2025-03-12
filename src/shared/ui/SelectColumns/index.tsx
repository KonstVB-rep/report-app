import React from "react";
import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListChecks } from "lucide-react";

interface SelectColumnsProps<TData> {
  data: Table<TData>;
}
const SelectColumns = <TData,>({ data }: SelectColumnsProps<TData>) => {

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={`${hiddenColumnsCount ? "border-solid" : "border-dashed"} border-muted-foreground`}>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {data
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value: boolean) =>
                  column.toggleVisibility(!!value)
                }
              >
                {column.columnDef.header as string}
              </DropdownMenuCheckboxItem>
            );
          })}
          {hiddenColumnsCount > 0 && <Button onClick={handleResetVisibility} variant={"outline"} className="w-full">Очистить фильтр</Button>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelectColumns;
