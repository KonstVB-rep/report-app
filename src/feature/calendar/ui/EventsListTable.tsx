import { flexRender } from "@tanstack/react-table";
import { Table as ReactTable } from "@tanstack/react-table";

import React, { RefObject } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useScrollIntoViewBottom from "@/shared/hooks/useScrollIntoViewBottomTable";

import { EventInputType } from "../types";

type EventsListTableProps<T> = {
  table: ReactTable<T>;
  handleRowClick?: (row: T) => void;
};

const EventsListTable = <T,>({
  table,
  handleRowClick,
}: EventsListTableProps<T>) => {
  const ref = useScrollIntoViewBottom<T, HTMLTableElement>(
    table
  ) as RefObject<HTMLTableElement>;

  if (!table) {
    return <div className="w-full p-4 text-center">Загрузка данных...</div>;
  }

  return (
    <>
      <Table
        className="w-full border-separate border-spacing-0 border"
        ref={ref}
      >
        <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={`border-r border-zinc-600 px-3 py-2 dark:bg-zinc-800 ${header.column.id === "title" ? "" : "whitespace-nowrap"}`}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center text-center justify-center w-full gap-1 h-full text-primary"
                          : "flex items-center justify-center h-full w-full text-center text-primary",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      <span className="text-start text-xs font-semibold first-letter:capitalize">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="table-grid-container space-y-[2px]">
          {table?.getRowModel()?.rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => {
              const eventData = row.original as EventInputType;
              const isPastEvent = new Date(eventData.end) < new Date(); // Проверяем, прошло ли событие

              return (
                <TableRow
                  key={row.id}
                  className={`tr hover:bg-zinc-600 hover:text-white ${
                    isPastEvent ? "opacity-50" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      onClick={() => handleRowClick?.(cell.row.original)}
                      key={cell.id}
                      className={`td w-fit border-b border-r  ${cell.column.id === "title" ? "" : "whitespace-nowrap"}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow className="h-[50px]">
              <TableCell
                colSpan={table.getAllColumns().length}
                className="py-4"
              >
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 transform whitespace-nowrap">
                  Нет данных
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default EventsListTable;
