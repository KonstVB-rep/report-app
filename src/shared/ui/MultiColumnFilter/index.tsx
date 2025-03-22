/* eslint-disable @typescript-eslint/no-unused-vars */
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
import React, { useState, useEffect } from "react";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import DebouncedInput from "../DebouncedInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const parseParams = (str: string, includedColumns: string[]) => {
  if (!str) return { columns: [], value: "" };
  const strSplit = str.split("&");
  const filterStrSplit = strSplit.filter((item) => {
    const filter = item.split("=")[0];
    return includedColumns.includes(filter);
  });
  return {
    columns: filterStrSplit.map((item) => item.split("=")[0]),
    value: filterStrSplit[0]?.split("=")[1] || "",
  };
};

interface MultiColumnFilterProps<TData extends Record<string, unknown>, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  includedColumns: string[];
  columnFilters: ColumnFiltersState;
  setColumnFilters: (callback: (prev: ColumnFiltersState) => ColumnFiltersState) => void;
}

const MultiColumnFilter = <TData extends Record<string, unknown>, TValue = unknown>({
  columns,
  includedColumns = [],
  columnFilters,
  setColumnFilters,
}: MultiColumnFilterProps<TData, TValue>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => parseParams(decodeURIComponent(searchParams.toString()), includedColumns).columns);
  const [filterValue, setFilterValue] = useState<string>(() => parseParams(decodeURIComponent(searchParams.toString()), includedColumns).value);

  // Обновление фильтров и URL
  useEffect(() => {
    const newFilters: ColumnFiltersState = selectedColumns
      .filter((columnId) => filterValue) // Применяем фильтр только если есть значение
      .map((columnId) => ({ id: columnId, value: filterValue }));

    const combinedFilters = [
      ...columnFilters.filter((item) => !selectedColumns.includes(item.id)),
      ...newFilters,
    ];

    // Обновляем фильтры только если они изменились
    setColumnFilters((prevFilters) => {
      const prevFiltersString = JSON.stringify(prevFilters);
      const combinedFiltersString = JSON.stringify(combinedFilters);
      if (prevFiltersString !== combinedFiltersString) {
        return combinedFilters;
      }
      return prevFilters;
    });

    // Обновление URL с новыми параметрами
    const newParams = new URLSearchParams(searchParams.toString());
    includedColumns.forEach((col) => {
      if (selectedColumns.includes(col) && filterValue) { // Только если есть значение
        newParams.set(col, filterValue); // Добавляем параметр для фильтра
      } else {
        newParams.delete(col); // Убираем фильтры, если колонка снята
      }
    });

    const newUrl = `${pathname}?${newParams.toString()}`;
    const currentUrl = `${pathname}?${searchParams.toString()}`;

    if (newUrl !== currentUrl) {
      router.replace(newUrl);
    }
  }, [selectedColumns, filterValue, columnFilters, setColumnFilters, includedColumns, searchParams, pathname, router]);

  const handleClear = () => {
    setSelectedColumns([]);
    setFilterValue("");

    // Убираем все фильтры из columnFilters
    setColumnFilters((prevFilters) =>
      prevFilters.filter((filter) => !selectedColumns.includes(filter.id))
    );
  };

  const filteredColumns = columns.filter((column) => !!column.id && includedColumns.includes(column.id));

  const handleCheckboxChange = (columnId: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]
    );
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild className={`border-muted-foreground ${selectedColumns.length > 0 ? "border-solid" : "border-dashed"}`}>
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
            <DebouncedInput
              type="text"
              value={filterValue}
              onChange={(value: string) => setFilterValue(value)}
              placeholder="Поиск..."
              className="w-36 border shadow rounded"
            />
            <div className="grid grid-cols-1 items-center gap-1">
              {filteredColumns.map(({ id, header }) => {
                if (!id) return null;
                return (
                  <div key={id} className="flex items-center gap-1 text-sm w-fit px-1">
                    <Checkbox
                      key={`checkbox-${id}`}
                      id={id}
                      checked={selectedColumns.includes(id)}
                      onCheckedChange={() => handleCheckboxChange(id)}
                    />
                    <label htmlFor={id} className="ml-2 cursor-pointer text-sm font-medium leading-none">
                      {typeof header === "string" ? header : id}
                    </label>
                  </div>
                );
              })}
            </div>
            {selectedColumns.length > 0 && (
              <Button onClick={handleClear} variant="outline" className="w-full text-xs">
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

