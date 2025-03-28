import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, Row, useReactTable } from "@tanstack/react-table";

import { MoveUp, MoveDown, ArrowDownUp } from "lucide-react";
import React, { ReactNode, RefObject } from "react";
import ContextRowTable from "../ContextRowTable/ContextRowTable";
import useScrollIntoViewBottomTable from "@/shared/hooks/useScrollIntoViewBottomTable";

type TableComponentProps<T> = {
  table: ReturnType<typeof useReactTable<T>>;
  getRowLink?: (row: T & { id: string }, type: string) => string;
};

const TableComponent = <T extends Record<string, unknown>>({
  table,
}: TableComponentProps<T>) => {

  const ref = useScrollIntoViewBottomTable(
    table
  ) as unknown as RefObject<HTMLTableElement | null>;
  const renderRowCells = (row: Row<T>) => {
    return row.getVisibleCells().map((cell) => (
      <TableCell
        key={cell.id}
        className="td min-w-12 border-b border-r"
        style={{ width: cell.column.getSize() }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ));
  };

  const renderRow = (row: Row<T>): ReactNode => {
    return (
      <ContextRowTable key={row.id} rowData={row.original}>
        <TableRow className="tr hover:bg-zinc-600 hover:text-white">
          {renderRowCells(row)}
        </TableRow>
      </ContextRowTable>
    );
  };

  return (
    <Table
      className="mb-2 w-full border-separate border-spacing-0 rounded-lg border"
      ref={ref}
    >
      <TableHeader className="z-1 sticky top-0">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className="border-r border-zinc-600 bg-zinc-400 px-3 py-2 dark:bg-zinc-800"
                style={{ position: "relative", width: header.getSize() }}
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
                {header.column.getCanResize() && (
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${
                      header.column.getIsResizing() ? "isResizing" : ""
                    }`}
                  ></div>
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      {
        <TableBody className="table-grid-container space-y-[2px]">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(renderRow)
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
      }
    </Table>
  );
};

export default TableComponent;
