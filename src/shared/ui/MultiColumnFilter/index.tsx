// // // import React, { useState, useEffect } from "react";
// // // import { ColumnDef, ColumnFiltersState, Table } from "@tanstack/react-table";
// // // import DebouncedInput from "../DebouncedInput";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import {
// // //   Popover,
// // //   PopoverTrigger,
// // //   PopoverContent,
// // // } from "@radix-ui/react-popover";
// // // import { Filter } from "lucide-react";
// // // import { Button } from "@/components/ui/button";

// // // interface MultiColumnFilterProps<TData extends Record<string, unknown>, TValue = unknown> {
// // //   table: Table<TData>;
// // //   columns: ColumnDef<TData, TValue>[];
// // //   excludedColumns: string[];
// // // }

// // // const MultiColumnFilter = <TData extends Record<string, unknown>, TValue = unknown>({
// // //   table,
// // //   columns,
// // //   excludedColumns = [],
// // // }: MultiColumnFilterProps<TData, TValue>) => {
// // //   const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
// // //   const [filterValue, setFilterValue] = useState<string>("");
// // //   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

// // //   const [open, setOpen] = useState(false);

// // //   useEffect(() => {
// // //     if (selectedColumns.length > 0 && filterValue) {
// // //       const newFilters = selectedColumns.map((columnId) => ({
// // //         id: columnId,
// // //         value: filterValue,
// // //       }));
// // //       setColumnFilters(newFilters);
// // //     } else {
// // //       setColumnFilters([]);
// // //     }
// // //   }, [selectedColumns, filterValue]);

// // //   const handleCheckboxChange = (columnId: string) => {
// // //     setSelectedColumns((prev) =>
// // //       prev.includes(columnId)
// // //         ? prev.filter((id) => id !== columnId)
// // //         : [...prev, columnId]
// // //     );
// // //   };

// // //   const handleClear = () => {
// // //     setSelectedColumns([]);
// // //     setFilterValue("");
// // //     setColumnFilters([]); // Clear column filters
// // //   };

// // //   useEffect(() => {
// // //     table.setColumnFilters(columnFilters);
// // //   }, [columnFilters, table]);

// // //   const filteredColumns = columns.filter(
// // //     (column) => !!column.id && !excludedColumns.includes(column.id) // Изменение тут
// // //   );

// // //   return (
// // //     <div className="flex gap-2">
// // //       <Popover open={open} onOpenChange={setOpen}>
// // //         <PopoverTrigger asChild  className={`border-muted-foreground ${
// // //           selectedColumns.length > 0 ? "border-solid" : "border-dashed"
// // //         } `}>
// // //           <Button variant="outline" className="relative">
// // //             <Filter className="mr-2 h-4 w-4" />
// // //             <span>Поиск в колонках</span>
// // //             {selectedColumns.length > 0 && (
// // //               <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 h-4 w-4 inline-flex items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
// // //                 {selectedColumns.length}
// // //               </span>
// // //             )}
// // //           </Button>
// // //         </PopoverTrigger>
// // //         <PopoverContent className="w-fit p-2 border border-solid border- z-50 rounded-md bg-popover relative top-1">
// // //           <div className="grid gap-4">
// // //           <div className="grid grid-cols-1 items-center gap-1">
// // //               {filteredColumns.map(({ id, header }) => {
// // //                  if (!id) return null;
// // //                 return (
// // //                   <div
// // //                     key={id}
// // //                     className="flex items-center gap-1 text-sm w-fit px-1"
// // //                   >
// // //                     <Checkbox
// // //                       key={`checkbox-${id}`}
// // //                       id={id}
// // //                       checked={selectedColumns.includes(id)}
// // //                       onCheckedChange={() => handleCheckboxChange(id)}
// // //                       className=""
// // //                     />
// // //                     <label
// // //                       htmlFor={id}
// // //                       className="ml-2 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
// // //                     >
// // //                     {typeof header === "string" ? header : id} {/* label - теперь string */}
// // //                     </label>
// // //                   </div>
// // //                 )
// // //                })}
// // //             </div>
// // //             {selectedColumns.length > 0 && (
// // //               <Button
// // //                 onClick={handleClear}
// // //                 variant="outline"
// // //                 className="w-full btn_hover text-xs"
// // //               >
// // //                 Очистить фильтр
// // //               </Button>
// // //             )}
// // //           </div>
// // //         </PopoverContent>
// // //       </Popover>
// // //       <DebouncedInput
// // //         type="text"
// // //         value={filterValue}
// // //         onChange={(value: string) => setFilterValue(value)}
// // //         placeholder={`Search...`}
// // //         className="w-36 border shadow rounded"
// // //       />
// // //     </div>
// // //   );
// // // };

// // // export default MultiColumnFilter ;
// // import React, { useState, useEffect, useCallback } from "react";
// // import { ColumnDef, ColumnFiltersState, Table } from "@tanstack/react-table";
// // import DebouncedInput from "../DebouncedInput";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import {
// //   Popover,
// //   PopoverTrigger,
// //   PopoverContent,
// // } from "@radix-ui/react-popover";
// // import { Filter } from "lucide-react";
// // import { Button } from "@/components/ui/button";

// // interface MultiColumnFilterProps<TData extends Record<string, unknown>, TValue = unknown> {
// //   table: Table<TData>;
// //   columns: ColumnDef<TData, TValue>[];
// //   excludedColumns: string[];
// //   columnFilters: ColumnFiltersState;
// //   setColumnFilters: (
// //     callback: (prev: ColumnFiltersState) => ColumnFiltersState
// //   ) => void;
// // }

// // const areFiltersEqual = (a: ColumnFiltersState, b: ColumnFiltersState) => {
// //   if (a.length !== b.length) return false;
// //   for (let i = 0; i < a.length; i++) {
// //     const filterA = a[i];
// //     const filterB = b[i];
// //     if (filterA.id !== filterB.id || filterA.value !== filterB.value) {
// //       return false;
// //     }
// //   }
// //   return true;
// // };

// // const MultiColumnFilter = <TData extends Record<string, unknown>, TValue = unknown>({
// //   table,
// //   columns,
// //   excludedColumns = [],
// //   columnFilters,
// //   setColumnFilters,
// // }: MultiColumnFilterProps<TData, TValue>) => {
// //   const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
// //   const [filterValue, setFilterValue] = useState<string>("");
// //   const [open, setOpen] = useState(false);

// //   const updateFilters = useCallback(() => {
// //     const newFilters: ColumnFiltersState = [];
// //     if (selectedColumns.length > 0 && filterValue) {
// //       selectedColumns.forEach((columnId) => {
// //         newFilters.push({ id: columnId, value: filterValue });
// //       });
// //     }

// //     const filtered = columnFilters.filter(item => !selectedColumns.includes(item.id));
// //     const combinedFilters = [...filtered, ...newFilters];

// //     if (!areFiltersEqual(columnFilters, combinedFilters)) {
// //       setColumnFilters(combinedFilters);
// //     }
// //   }, [selectedColumns, filterValue, setColumnFilters, columnFilters]);

// //   useEffect(() => {
// //     updateFilters();
// //   }, [updateFilters]);

// //   useEffect(() => {
// //     table.setColumnFilters(columnFilters);
// //   }, [columnFilters, table]);

// //   const handleCheckboxChange = (columnId: string) => {
// //     setSelectedColumns((prev) =>
// //       prev.includes(columnId)
// //         ? prev.filter((id) => id !== columnId)
// //         : [...prev, columnId]
// //     );
// //   };

// //   const handleClear = () => {
// //     setSelectedColumns([]);
// //     setFilterValue("");
// //     setColumnFilters((prev) => prev.filter(item => !selectedColumns.includes(item.id)));
// //   };

// //   const filteredColumns = columns.filter(
// //     (column) => !!column.id && !excludedColumns.includes(column.id)
// //   );

// //   return (
// //     <div className="flex gap-2">
// //       <Popover open={open} onOpenChange={setOpen}>
// //         <PopoverTrigger asChild className={`border-muted-foreground ${selectedColumns.length > 0 ? "border-solid" : "border-dashed"}`}>
// //           <Button variant="outline" className="relative">
// //             <Filter className="mr-2 h-4 w-4" />
// //             <span>Поиск в колонках</span>
// //             {selectedColumns.length > 0 && (
// //               <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 h-4 w-4 inline-flex items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
// //                 {selectedColumns.length}
// //               </span>
// //             )}
// //           </Button>
// //         </PopoverTrigger>
// //         <PopoverContent className="w-fit p-2 border border-solid border- z-50 rounded-md bg-popover relative top-1">
// //           <div className="grid gap-4">
// //             <div className="grid grid-cols-1 items-center gap-1">
// //               {filteredColumns.map(({ id, header }) => {
// //                 if (!id) return null;
// //                 return (
// //                   <div
// //                     key={id}
// //                     className="flex items-center gap-1 text-sm w-fit px-1"
// //                   >
// //                     <Checkbox
// //                       key={`checkbox-${id}`}
// //                       id={id}
// //                       checked={selectedColumns.includes(id)}
// //                       onCheckedChange={() => handleCheckboxChange(id)}
// //                       className=""
// //                     />
// //                     <label
// //                       htmlFor={id}
// //                       className="ml-2 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
// //                     >
// //                       {typeof header === "string" ? header : id}
// //                     </label>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //             {selectedColumns.length > 0 && (
// //               <Button
// //                 onClick={handleClear}
// //                 variant="outline"
// //                 className="w-full btn_hover text-xs"
// //               >
// //                 Очистить фильтр
// //               </Button>
// //             )}
// //           </div>
// //         </PopoverContent>
// //       </Popover>
// //       <DebouncedInput
// //         type="text"
// //         value={filterValue}
// //         onChange={(value: string) => setFilterValue(value)}
// //         placeholder={`Search...`}
// //         className="w-36 border shadow rounded"
// //       />
// //     </div>
// //   );
// // };

// // export default MultiColumnFilter;
import React, { useEffect } from "react";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import DebouncedInput from "../DebouncedInput";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface MultiColumnFilterProps<
  TData extends Record<string, unknown>,
  TValue = unknown,
> {
  columns: ColumnDef<TData, TValue>[];
  includedColumns: string[];
  selectedColumns: string[];
  setSelectedColumns: React.Dispatch<React.SetStateAction<string[]>>;
  filterValueSearchByCol: string;
  setFilterValueSearchByCol: React.Dispatch<React.SetStateAction<string>>;
  setColumnFilters: (
    callback: (prev: ColumnFiltersState) => ColumnFiltersState
  ) => void;
}

const MultiColumnFilter = <
  TData extends Record<string, unknown>,
  TValue = unknown,
>({
  columns,
  includedColumns = [],
  selectedColumns,
  setSelectedColumns,
  filterValueSearchByCol,
  setFilterValueSearchByCol,
  setColumnFilters,
}: MultiColumnFilterProps<TData, TValue>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
  
    // Формируем строку с фильтрами
    if (selectedColumns.length > 0 && filterValueSearchByCol) {
      // Получаем текущие фильтры
      const existingFilters = newParams.get("filters");
  
      // Если фильтры есть
      if (existingFilters) {
        const filterArray = existingFilters.split("&");
        let filterUpdated = false;
  
        const updatedFilters = filterArray.map((filter) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [key, value] = filter.split("=");
  
          // Если фильтр для этого столбца, обновляем его
          if (selectedColumns.includes(key)) {
            filterUpdated = true; // Фильтр обновлен
            return `${key}="${encodeURIComponent(filterValueSearchByCol)}"`;
          }
  
          // Если фильтр для другого столбца, оставляем без изменений
          return filter;
        });
  
        // Если фильтра для этого столбца не было, добавляем новый
        if (!filterUpdated) {
          updatedFilters.push(`${selectedColumns[0]}="${encodeURIComponent(filterValueSearchByCol)}"`);
        }
  
        // Преобразуем обновленные фильтры обратно в строку
        newParams.set("filters", updatedFilters.join("&"));
      } else {
        // Если фильтров нет, просто добавляем их
        newParams.set("filters", `${selectedColumns[0]}="${encodeURIComponent(filterValueSearchByCol)}"`);
      }
    }
  
    const newUrl = `${pathname}?${newParams.toString()}`;
    const currentUrl = `${pathname}?${searchParams.toString()}`;
  
    // Обновляем URL, если он изменился
    if (newUrl !== currentUrl) {
      router.replace(newUrl);
    }
  }, [selectedColumns, filterValueSearchByCol, pathname, router, searchParams]);
  

  const handleClear = () => {
    setSelectedColumns([]);
    setFilterValueSearchByCol("");

    // Убираем все фильтры из columnFilters
    setColumnFilters((prevFilters) =>
      prevFilters.filter((filter) => !selectedColumns.includes(filter.id))
    );
  };

  const filteredColumns = columns.filter(
    (column) => !!column.id && includedColumns.includes(column.id)
  );

  const handleCheckboxChange = (columnId: string) => {
    setSelectedColumns((prev: string[]) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );

    // Добавляем фильтр или удаляем его
    if (selectedColumns.includes(columnId)) {
      setColumnFilters((prevFilters) =>
        prevFilters.filter((filter) => filter.id !== columnId)
      );
    }
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger
          asChild
          className={`border-muted-foreground ${selectedColumns.length > 0 ? "border-solid" : "border-dashed"}`}
        >
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            <span>Поиск в колонках</span>
            {selectedColumns.length > 0 && (
              <span className="absolute right-0 top-0 inline-flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {selectedColumns.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="border- relative top-1 z-50 w-fit rounded-md border border-solid bg-popover p-2">
          <div className="grid gap-4">
            <DebouncedInput
              type="text"
              value={filterValueSearchByCol}
              onChange={(value: string) => setFilterValueSearchByCol(value)}
              placeholder="Поиск..."
              className="w-36 rounded border shadow"
            />
            <div className="grid grid-cols-1 items-center gap-1">
              {filteredColumns.map(({ id, header }) => {
                if (!id) return null;
                return (
                  <div
                    key={id}
                    className="flex w-fit items-center gap-1 px-1 text-sm"
                  >
                    <Checkbox
                      key={`checkbox-${id}`}
                      id={id}
                      checked={selectedColumns.includes(id)}
                      onCheckedChange={() => handleCheckboxChange(id)}
                    />
                    <label
                      htmlFor={id}
                      className="ml-2 cursor-pointer text-sm font-medium leading-none"
                    >
                      {typeof header === "string" ? header : id}
                    </label>
                  </div>
                );
              })}
            </div>
            {selectedColumns.length > 0 && (
              <Button
                onClick={handleClear}
                variant="outline"
                className="w-full text-xs"
              >
                Очистить фильтр
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiColumnFilter;
