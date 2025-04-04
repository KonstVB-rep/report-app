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
import FilterByUser from "../Filters/FilterByUsers";
import { useParams, useSearchParams } from "next/navigation";

import AddNewDeal from "@/entities/deal/ui/Modals/AddNewDeal";
import TableRowsSkeleton from "../../../entities/deal/ui/Skeletons/TableRowsSkeleton";
import FiltersManagment from "@/feature/tableFilters/ui/FiltersManagment";
import useDataTableFilters from "@/entities/deal/hooks/useDataTableFilters";
// import { Button } from "@/components/ui/button";
// import iconsTypeFile from "@/widgets/Files/ui/FileList/iconsTypeFile";

// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

// const downloadToExcel = (data: any[]) => {
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Table Data');

//   // const columnsToExclude = Object.keys(columnVisibility).filter(col => !columnVisibility[col]); видимые колонки
//   //const columnsToExclude = [
// //   ...Object.keys(columnVisibility).filter(col => !columnVisibility[col]), // Скрытые колонки
// //   ...selectedColumns.filter(col => !columnFilters.some(filter => filter.id === col)) // Фильтруемые колонки
// // ];
// // СТРОКИ
// // const filteredData = data.filter(item => {
// //   // Применяем фильтрацию по всем активным фильтрам (например, по значениям в колонке)
// //   return columnFilters.every(filter => {
// //     const value = item[filter.id];
// //     if (filter.value) {
// //       return value.toString().toLowerCase().includes(filter.value.toString().toLowerCase()); // Простая фильтрация по значению
// //     }
// //     return true; // Если фильтра нет, оставляем строку
// //   });
// // });
  
//   // Добавление заголовков (если они есть в data)
//   const columns = Object.keys(data[0] || {});
//   worksheet.columns = columns.map(col => ({
//     header: col,
//     key: col,
//     width: 20,
//   }));

//   // Заполнение данных в таблицу
//   data.forEach((item) => {
//     worksheet.addRow(item);
//   });

//   // Экспорт файла в Excel
//   workbook.xlsx.writeBuffer().then((buffer) => {
//     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     saveAs(blob, 'table-data.xlsx');
//   });
// };

const includedColumns = [
  "nameObject",
  "nameDeal",
  "contact",
  "phone",
  "email",
  "additionalContact",
  "comments",
];

// Разбор строки URL в объект скрытых колонок
interface DataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowLink?: (row: TData & { id: string }, type: string) => string;
  type: keyof typeof DealTypeLabels;
  isPending: boolean;
}

const DataTable = <TData extends Record<string, unknown>, TValue>({
  columns,
  data,
  getRowLink,
  type,
  isPending,
}: DataTableProps<TData, TValue>) => {
  const searchParams = useSearchParams();
  const { dealType } = useParams();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const value = columnFilters.find((f) => f.id === "dateRequest")?.value as
    | DateRange
    | undefined;

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility: {
        ...columnVisibility, // Сохраняем остальные настройки видимости
        user: false,
        // resource: false // Скрываем колонку с id 'user'
      },
    },
    meta: {
      columnVisibility: {
        resource: false,
        // user: false,
      },
    },
  });

  const {
    selectedColumns,
    setSelectedColumns,
    filterValueSearchByCol,
    setFilterValueSearchByCol,
    openFilters,
    setOpenFilters,
    handleDateChange,
    handleClearDateFilter,
  } = useDataTableFilters({
    searchParams,
    includedColumns,
    setColumnFilters,
    setColumnVisibility,
    columnFilters,
    columnVisibility,
  });

  return (
    <div className="relative grid w-full overflow-hidden rounded-lg border bg-background p-2">
      {/* <Button
        onClick={() => downloadToExcel(data )}
        className="bg-white p-2 hover:bg-slate-700"
        title="Export to XLSX"
      >
        {iconsTypeFile[".xls"]({ width: 20, height: 20 })}
      </Button> */}
      <div className="flex items-center justify-between gap-2 pb-2">
        <div className="flex flex-1 items-center justify-between gap-2">
          <FiltersManagment
            setColumnFilters={setColumnFilters}
            setColumnVisibility={setColumnVisibility}
            setSelectedColumns={setSelectedColumns}
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
            columnFilters={columnFilters}
            columnVisibility={columnVisibility}
            selectedColumns={[]}
          />
        </div>

        <AddNewDeal type={dealType as string} />
      </div>
      <div
        className={`grid overflow-hidden transition-all duration-200 ${openFilters ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0">
          <FilterByUser
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />

          <div className="mt-2 flex flex-wrap justify-between gap-2">
            <DateRangeFilter
              onDateChange={handleDateChange}
              onClearDateFilter={handleClearDateFilter}
              value={value}
            />

            <MultiColumnFilter
              columns={columns}
              setColumnFilters={setColumnFilters}
              includedColumns={includedColumns}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
              filterValueSearchByCol={filterValueSearchByCol}
              setFilterValueSearchByCol={setFilterValueSearchByCol}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 bg-background">
            <div className="flex flex-wrap items-center justify-start gap-2 bg-background">
              <FilterPopoverGroup
                options={[
                  {
                    label: "Статус",
                    columnId: "dealStatus",
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
          </div>
        </div>
      </div>

      {isPending ? (
        <TableRowsSkeleton />
      ) : data.length ? (
        <TableComponent table={table} getRowLink={getRowLink} />
      ) : (
        <h1 className="my-2 rounded-md bg-muted px-4 py-2 text-center text-xl">
          Проекты не найдены
        </h1>
      )}
    </div>
  );
};

export default DataTable;
