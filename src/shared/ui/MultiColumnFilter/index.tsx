import React, { useState, useEffect } from "react";
import { ColumnDef, ColumnFiltersState, Table } from "@tanstack/react-table";
import DebouncedInput from "../DebouncedInput";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MultiColumnFilterProps<TData extends Record<string, unknown>, TValue = unknown> {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
  excludedColumns: string[];
}

const MultiColumnFilter = <TData extends Record<string, unknown>, TValue = unknown>({
  table,
  columns,
  excludedColumns = [],
}: MultiColumnFilterProps<TData, TValue>) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filterValue, setFilterValue] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedColumns.length > 0 && filterValue) {
      const newFilters = selectedColumns.map((columnId) => ({
        id: columnId,
        value: filterValue,
      }));
      setColumnFilters(newFilters);
    } else {
      setColumnFilters([]);
    }
  }, [selectedColumns, filterValue]);

  const handleCheckboxChange = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleClear = () => {
    setSelectedColumns([]);
    setFilterValue("");
    setColumnFilters([]); // Clear column filters
  };

  useEffect(() => {
    table.setColumnFilters(columnFilters);
  }, [columnFilters, table]);

  const filteredColumns = columns.filter(
    (column) => !!column.id && !excludedColumns.includes(column.id) // Изменение тут
  );

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild  className={`${
          selectedColumns.length > 0 ? "border-solid" : "border-dashed"
        } border-muted-foreground`}>
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            <span>Поиск в колонках</span>
            {selectedColumns.length > 0 && (
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 h-4 w-4 inline-flex items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {selectedColumns.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-2 border border-solid border- z-50 rounded-md bg-popover relative top-1">
          <div className="grid gap-4">
          <div className="grid grid-cols-1 items-center gap-1">
              {filteredColumns.map(({ id, header }) => {
                 if (!id) return null;
                return (
                  <div
                    key={id} 
                    className="flex items-center gap-1 text-sm w-fit px-1"
                  >
                    <Checkbox
                      key={`checkbox-${id}`} 
                      id={id} 
                      checked={selectedColumns.includes(id)}
                      onCheckedChange={() => handleCheckboxChange(id)}
                      className=""
                    />
                    <label
                      htmlFor={id}
                      className="ml-2 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    {typeof header === "string" ? header : id} {/* label - теперь string */}
                    </label>
                  </div>
                )
               })}
            </div>
            {selectedColumns.length > 0 && (
              <Button
                onClick={handleClear}
                variant="outline"
                className="w-full"
              >
                Очистить фильтр
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <DebouncedInput
        type="text"
        value={filterValue}
        onChange={(value: string) => setFilterValue(value)}
        placeholder={`Search...`}
        className="w-36 border shadow rounded"
      />
    </div>
  );
};

export default MultiColumnFilter;
