"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  ColumnDef,
} from "@tanstack/react-table";
import SelectColumns from "../SelectColumns";
import { DateRange } from "react-day-picker";
import DateRangeFilter from "../DateRangeFilter";
import { DealTypeLabels, LABELS } from "@/entities/deal/lib/constants";
import MultiColumnFilter from "../MultiColumnFilter";
import TableComponent from "./TableComponent";
import FilterPopoverGroup from "../Filters/FilterPopoverGroup";
import FilterPopover from "../Filters/FilterPopover";
import RenderFilterPopover from "../Filters/RenderFilterPopover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowLink?: (row: TData & { id: string }, type: string) => string;
  type: keyof typeof DealTypeLabels;
}

const DataTable = <TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  getRowLink,
  type,
}: DataTableProps<TData, TValue>) => {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
    setColumnFilters((prev) => {
      if (!date?.from && !date?.to) {
        return prev.filter((f) => f.id !== "dateRequest");
      }
      return prev.some((f) => f.id === "dateRequest")
        ? prev.map((f) =>
            f.id === "dateRequest" ? { ...f, value: date || {} } : f
          )
        : [...prev, { id: "dateRequest", value: date || {} }];
    });
  };

  const handleClearDateFilter = (columnId: string) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
  };

  return (
    <div className="flex flex-col bg-background w-full max-h-[80vh] overflow-auto border rounded-lg p-2">

      {/* <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:no-underline p-2 mb-2 bg-zinc-700 rounded-full w-fit max-w-fit flex gap-2">Фильтры</AccordionTrigger>
          <AccordionContent> */}
            <div className="pb-2">
              <RenderFilterPopover
                renderFilter={(usersDepartment) => (
                  <FilterPopover
                    columnId="user"
                    options={usersDepartment}
                    label="Менеджер"
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                  />
                )}
              />
            </div>
            <div className="flex gap-2 justify-between">
              <DateRangeFilter
                onDateChange={handleDateChange}
                onClearDateFilter={handleClearDateFilter}
                value={
                  columnFilters.find((f) => f.id === "dateRequest")?.value as
                    | DateRange
                    | undefined
                }
              />
              <MultiColumnFilter
                table={table}
                columns={columns}
                excludedColumns={[
                  "rowNumber",
                  "direction",
                  "deliveryType",
                  "dateRequest",
                  "user",
                  "plannedDateConnection",
                  "projectStatus",
                  "delta",
                  "amountCP",
                  "amountPurchase",
                  "amountWork",
                ]}
              />
            </div>
            <div className="flex flex-wrap items-center justify-start gap-2 bg-background">
              <FilterPopoverGroup
                options={[
                  {
                    label: "Статус",
                    columnId: "projectStatus",
                    options: LABELS[type].STATUS,
                  },
                  {
                    label: "Направление",
                    columnId: "direction",
                    options: LABELS[type].DIRECTION,
                  },
                  {
                    label: "Тип поставки",
                    columnId: "deliveryType",
                    options: LABELS[type].DELIVERY,
                  },
                ]}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
              />
              <SelectColumns data={table} />
            </div>
          {/* </AccordionContent>
        </AccordionItem>
      </Accordion> */}
      {/* <div className="pb-2">
        <RenderFilterPopover
          renderFilter={(usersDepartment) => (
            <FilterPopover
              columnId="user"
              options={usersDepartment}
              label="Менеджер"
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
            />
          )}
        />
      </div>
      <div className="flex gap-2 justify-between">
        <DateRangeFilter
          onDateChange={handleDateChange}
          onClearDateFilter={handleClearDateFilter}
          value={
            columnFilters.find((f) => f.id === "dateRequest")?.value as
              | DateRange
              | undefined
          }
        />
        <MultiColumnFilter
          table={table}
          columns={columns}
          excludedColumns={[
            "rowNumber",
            "direction",
            "deliveryType",
            "dateRequest",
            "user",
            "plannedDateConnection",
            "projectStatus",
            "delta",
            "amountCP",
            "amountPurchase",
            "amountWork",
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center justify-start gap-2 bg-background">
        <FilterPopoverGroup
          options={[
            {
              label: "Статус",
              columnId: "projectStatus",
              options: LABELS[type].STATUS,
            },
            {
              label: "Направление",
              columnId: "direction",
              options: LABELS[type].DIRECTION,
            },
            {
              label: "Тип поставки",
              columnId: "deliveryType",
              options: LABELS[type].DELIVERY,
            },
          ]}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <SelectColumns data={table} />
      </div> */}
      <TableComponent data={data} getRowLink={getRowLink} table={table} />
    </div>
  );
};

export default DataTable;

// "use client";


// import React, { useEffect, useState } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   SortingState,
//   getSortedRowModel,
//   getFilteredRowModel,
//   ColumnFiltersState,
//   VisibilityState,
//   ColumnDef,
// } from "@tanstack/react-table";
// import SelectColumns from "../SelectColumns";
// import { DateRange } from "react-day-picker";
// import DateRangeFilter from "../DateRangeFilter";
// import { DealTypeLabels, LABELS } from "@/entities/deal/lib/constants";
// import MultiColumnFilter from "../MultiColumnFilter";
// import TableComponent from "./TableComponent";
// import FilterPopoverGroup from "../Filters/FilterPopoverGroup";
// import FilterPopover from "../Filters/FilterPopover";
// import RenderFilterPopover from "../Filters/RenderFilterPopover";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";

// interface DataTableProps<TData, TValue = unknown> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   getRowLink?: (row: TData & { id: string }, type: string) => string;
//   type: keyof typeof DealTypeLabels;
// }

// const DataTable = <TData extends Record<string, unknown>, TValue>({
//   columns,
//   data,
//   getRowLink,
//   type,
// }: DataTableProps<TData, TValue>) => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   // Инициализация состояния фильтров из URL
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
//     const filtersFromUrl: { [key: string]: string } = {};
//     searchParams.forEach((value, key) => {
//       if (key.startsWith("filter_")) {
//         filtersFromUrl[key.replace("filter_", "")] = value;
//       }
//     });
//     return Object.entries(filtersFromUrl).map(([id, value]) => ({ id, value }));
//   });

//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [date, setDate] = useState<DateRange | undefined>(undefined);

//   // Обновление URL при изменении фильтров
//   useEffect(() => {
//     const params = new URLSearchParams(searchParams.toString());
//     columnFilters.forEach(({ id, value }) => {
//       if (value) {
//         params.set(`filter_${id}`, String(value));
//       } else {
//         params.delete(`filter_${id}`);
//       }
//     });

//     const queryString = params.toString();
//     const newPathname = `${pathname}${queryString ? `?${queryString}` : ""}`;
//     router.push(newPathname, { scroll: false });
//   }, [columnFilters, searchParams, pathname, router]);


//   const table = useReactTable({
//     data,
//     columns,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     onSortingChange: setSorting,
//     onColumnVisibilityChange: setColumnVisibility,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//     },
//   });

//   const handleDateChange = (date: DateRange | undefined) => {
//     setDate(date);
//     setColumnFilters((prev) => {
//       if (!date?.from && !date?.to) {
//         return prev.filter((f) => f.id !== "dateRequest");
//       }
//       return prev.some((f) => f.id === "dateRequest")
//         ? prev.map((f) =>
//             f.id === "dateRequest"
//               ? { ...f, value: JSON.stringify({ from: date?.from, to: date?.to }) }
//               : f
//           )
//         : [
//             ...prev,
//             {
//               id: "dateRequest",
//               value: JSON.stringify({ from: date?.from, to: date?.to }),
//             },
//           ];
//     });
//   };

//   const handleClearDateFilter = (columnId: string) => {
//     setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
//   };

//   return (
//     <div className="flex flex-col bg-background w-full max-h-[80vh] overflow-auto border rounded-lg p-2">
//       {/* <Accordion type="single" collapsible className="w-full">
//         <AccordionItem value="item-1">
//           <AccordionTrigger className="hover:no-underline p-2 mb-2 bg-zinc-700 rounded-full w-fit max-w-fit flex gap-2">
//             Фильтры
//           </AccordionTrigger>
//           <AccordionContent> */}
//             <div className="pb-2">
//               <RenderFilterPopover
//                 renderFilter={(usersDepartment) => (
//                   <FilterPopover
//                     columnId="user"
//                     options={usersDepartment}
//                     label="Менеджер"
//                     columnFilters={columnFilters}
//                     setColumnFilters={setColumnFilters}
//                   />
//                 )}
//               />
//             </div>
//             <div className="flex gap-2 justify-between">
//               <DateRangeFilter
//                 onDateChange={handleDateChange}
//                 onClearDateFilter={handleClearDateFilter}
//                 value={
//                   columnFilters.find((f) => f.id === "dateRequest")?.value
//                     ? JSON.parse(
//                         columnFilters.find((f) => f.id === "dateRequest")?.value as string
//                       )
//                     : undefined
//                 }
//               />
//               <MultiColumnFilter
//                 table={table}
//                 columns={columns}
//                 excludedColumns={[
//                   "rowNumber",
//                   "direction",
//                   "deliveryType",
//                   "dateRequest",
//                   "user",
//                   "plannedDateConnection",
//                   "projectStatus",
//                   "delta",
//                   "amountCP",
//                   "amountPurchase",
//                   "amountWork",
//                 ]}
//               />
//             </div>
//             <div className="flex flex-wrap items-center justify-start gap-2 bg-background">
//               <FilterPopoverGroup
//                 options={[
//                   {
//                     label: "Статус",
//                     columnId: "projectStatus",
//                     options: LABELS[type].STATUS,
//                   },
//                   {
//                     label: "Направление",
//                     columnId: "direction",
//                     options: LABELS[type].DIRECTION,
//                   },
//                   {
//                     label: "Тип поставки",
//                     columnId: "deliveryType",
//                     options: LABELS[type].DELIVERY,
//                   },
//                 ]}
//                 columnFilters={columnFilters}
//                 setColumnFilters={setColumnFilters}
//               />
//               <SelectColumns data={table} />
//             </div>
//           {/* </AccordionContent>
//         </AccordionItem>
//       </Accordion> */}
//       <TableComponent data={data} getRowLink={getRowLink} table={table} />
//     </div>
//   );
// };

// export default DataTable;
