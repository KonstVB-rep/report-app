import { flexRender, Row, useReactTable } from "@tanstack/react-table";

import React, { ReactNode, RefObject } from "react";

import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useScrollIntoViewBottom from "@/shared/hooks/useScrollIntoViewBottomTable";

type TableTemplateProps<T> = {
  table: ReturnType<typeof useReactTable<T>>;
  renderRow: (row: Row<T>) => ReactNode;
  className?: string;
};

const TableTemplate = <T extends Record<string, unknown>>({
  table,
  renderRow,
  className,
}: TableTemplateProps<T>) => {
  const ref = useScrollIntoViewBottom<T, HTMLTableElement>(
    table
  ) as RefObject<HTMLTableElement>;

  return (
    <Table
      className={`w-full border-separate border-spacing-0 border ${className}`}
      ref={ref}
    >
      <TableHeader className="z-1 sticky top-0">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className="border-r border-zinc-600 !p-2 bg-white dark:bg-zinc-800"
                style={{
                  position: "relative",
                  width: header.getSize(),
                  minWidth: header.column.columnDef.minSize,
                }}
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

      <TableBody className="table-grid-container space-y-[2px]">
        {table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map(renderRow)
        ) : (
          <TableRow className="h-[50px]">
            <TableCell colSpan={table.getAllColumns().length} className="py-4">
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 transform whitespace-nowrap">
                Нет данных
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableTemplate;
