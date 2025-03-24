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
import React, { ReactNode } from "react";
import ContextRowTable from "../ContextRowTable/ContextRowTable";
import { useParams } from "next/navigation";
import { useGetProjectsUser } from "@/entities/deal/hooks/query";
import { PermissionEnum } from "@prisma/client";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";

type TableComponentProps<T> = {
  table: ReturnType<typeof useReactTable<T>>;
  data: T[];
  getRowLink?: (row: T & { id: string }, type: string) => string;
};

const TableComponent = <T extends Record<string, unknown>>({
  data,
  table,
}: TableComponentProps<T>) => {
  const { userId } = useParams();

  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT
  );

  const { isPending } = useGetProjectsUser(
    hasAccess ? (userId as string) : null
  );

  const renderRowCells = (row: Row<T>) => {
    // const rowLink = getRowLink
    //   ? getRowLink(row.original as T & { id: string }, row.original.type as string)
    //   : undefined;

    return row.getVisibleCells().map((cell) => (
      <TableCell key={cell.id} className="td min-w-12 border-b border-r">
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
        <TableRow className="tr hover:bg-zinc-600 hover:text-white">
          {renderRowCells(row)}
        </TableRow>
      </ContextRowTable>
    );
  };

  return (
    <>
      {data && data.length ? (
        <Table className="mb-2 mt-2 w-full border-separate border-spacing-0 rounded-lg border">
          <TableHeader className="z-1 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border-r border-zinc-600 bg-zinc-400 px-3 py-2 dark:bg-zinc-800"
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
      ) : isPending ? (
        Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="m-auto my-1 h-14 w-full animate-pulse rounded-lg bg-muted/50"
          />
        ))
      ) : (
        <h1 className="rounded-md bg-muted px-4 py-2 text-center text-xl">
          Проекты не найдены
        </h1>
      )}
    </>
  );
};

export default TableComponent;
