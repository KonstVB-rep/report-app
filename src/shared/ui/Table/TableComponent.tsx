import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  Row,
  useReactTable,
} from "@tanstack/react-table";

import { MoveUp, MoveDown, ArrowDownUp } from "lucide-react";
import React, { ReactNode } from "react";
import ContextRowTable from "../ContextRowTable/ContextRowTable";
// import Link from "next/link";

type TableComponentProps<T> = {
    table: ReturnType<typeof useReactTable<T>>;
    data: T[];
    getRowLink?: (row: T & { id: string }, type: string) => string;
};

const TableComponent =  <T extends Record<string, unknown>>({ data, table }: TableComponentProps<T>) => {

  const renderRowCells = (row: Row<T>) => {
    // const rowLink = getRowLink
    //   ? getRowLink(row.original as T & { id: string }, row.original.type as string)
    //   : undefined;


    return row.getVisibleCells().map((cell) => (
      <TableCell key={cell.id} className="td border-r border-b min-w-12">
        {/* {rowLink ? (
          <Link href={rowLink}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Link>
        ) : ( */}
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        {/* )} */}
      </TableCell>
    ));
  };

  const renderRow = (row: Row<T>): ReactNode => {
    return (
      <ContextRowTable key={row.id} rowData={row.original}>
        <TableRow className="hover:bg-zinc-600 hover:text-white tr">
          {renderRowCells(row)}
        </TableRow>
      </ContextRowTable>
    );
  };

  return (
    <>
      {data && data.length ? (
        <Table className="w-full border rounded-lg mb-2 border-separate border-spacing-0">
          <TableHeader className="sticky top-0 z-1">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border-r border-zinc-600 bg-zinc-400 dark:bg-zinc-800 py-2 px-3"
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
                        <span className="first-letter:capitalize font-semibold text-xs text-start">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span>
                            {header.column.getIsSorted() === "asc" ? (
                              <MoveUp className="ml-2 h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <MoveDown className="ml-2 h-4 w-4" />
                            ) : (
                              <ArrowDownUp className="ml-2 h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="space-y-[2px] table-grid-container">
            {table.getRowModel().rows.map(renderRow)}
          </TableBody>
        </Table>
      ) : (
        <h1 className="text-center text-xl py-2 px-4 bg-muted rounded-md">
          Проекты не найдены
        </h1>
      )}
    </>
  );
};

export default TableComponent;
