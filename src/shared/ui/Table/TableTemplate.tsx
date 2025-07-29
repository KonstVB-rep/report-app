import { DealType } from "@prisma/client";
import { flexRender, Row, useReactTable } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import React, { RefObject, useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DelDealContextMenu from "@/entities/deal/ui/Modals/DelDealContextMenu";
import EditDealContextMenu from "@/entities/deal/ui/Modals/EditDealContextMenu";

import ContextRowTable from "../ContextRowTable/ContextRowTable";
import { DealBase } from "./model/types";
import RowInfoDialog from "./RowInfoDialog";
import { getRowClassName } from "./TableComponent";

type TableTemplateProps<T extends DealBase> = {
  table: ReturnType<typeof useReactTable<T>>;
  className?: string;
  tableContainerRef: RefObject<HTMLDivElement | null>;
  hasEditDeleteActions: boolean;
};

const ROW_HEIGHT = 57;

const TableTemplate = <T extends DealBase>({
  table,
  className,
  tableContainerRef,
  hasEditDeleteActions,
}: TableTemplateProps<T>) => {
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => tableContainerRef.current,
    overscan: 15,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    setIsHydrating(false);
  }, []);

  return (
    <table
      className={`w-full grid border-separate border-spacing-0 border ${className}`}
    >
      <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-800">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            style={{ display: "flex", width: "100%" }}
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                style={{
                  width: header.getSize(),
                  minWidth: header.column.columnDef.minSize,
                }}
                className="border-r border-zinc-600 !p-2"
              >
                {header.isPlaceholder ? null : (
                  <div
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none flex items-center justify-center gap-1 h-full text-primary"
                        : "flex items-center justify-center h-full text-primary"
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="text-xs font-semibold first-letter:capitalize">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                    {header.column.getCanSort() && (
                      <span>
                        {{
                          asc: <MoveUp className="ml-2 h-4 w-4" />,
                          desc: <MoveDown className="ml-2 h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? (
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

      <TableBody style={{ height: `${totalSize}px`, position: "relative" }}>
        {isHydrating && <SkeletonTable />}
        {rows.length > 0 && !isHydrating ? (
          virtualItems.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <TableBodyRow
                key={row.id}
                row={row}
                virtualRow={virtualRow}
                hasEditDeleteActions={hasEditDeleteActions}
              />
            );
          })
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
    </table>
  );
};

type TableBodyRowProps<T> = {
  row: Row<T>;
  virtualRow: { index: number; start: number };
  hasEditDeleteActions: boolean;
};

const TableBodyRow = <T extends DealBase>({
  row,
  virtualRow,
  hasEditDeleteActions,
}: TableBodyRowProps<T>) => {
  const { departmentId } = useParams();
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null);

  const handleOpenInfo = (cellId: string) => {
    setOpenFullInfoCell(openFullInfoCell === cellId ? null : cellId);
  };

  return (
    <ContextRowTable
      hasEditDeleteActions={hasEditDeleteActions}
      modals={(setOpenModal) => ({
        edit: (
          <EditDealContextMenu
            close={() => setOpenModal(null)}
            id={row.original.id as string}
            type={row.original.type as DealType}
          />
        ),
        delete: (
          <DelDealContextMenu
            close={() => setOpenModal(null)}
            id={row.original.id as string}
            type={row.original.type as DealType}
          />
        ),
      })}
      path={`/dashboard/deal/${departmentId}/${(row.original.type as DealType).toLowerCase()}/${row.original.id}`}
    >
      <TableRow
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          transform: `translateY(${virtualRow.start}px)`,
        }}
        className={getRowClassName(row.original.dealStatus as string)}
        data-reject={row.original.dealStatus === "REJECT"}
        data-success={row.original.dealStatus === "PAID"}
        data-closed={row.original.dealStatus === "CLOSED"}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            style={{ width: cell.column.getSize() }}
            className="td min-w-12 border-b border-r leading-none box-border min-h-[57px]"
            onDoubleClick={() => handleOpenInfo(cell.id)}
          >
            <span className="line-clamp-2 text-center text-sm">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </span>
            {openFullInfoCell === cell.id && (
              <RowInfoDialog
                isActive={true}
                text={flexRender(cell.column.columnDef.cell, cell.getContext())}
                closeFn={() => setOpenFullInfoCell(null)}
              />
            )}
          </TableCell>
        ))}
      </TableRow>
    </ContextRowTable>
  );
};

export default TableTemplate;

const SkeletonTable = () => (
  <tr className="flex flex-col space-y-2">
    {[...Array(5)].map((_, i) => (
      <td
        key={i}
        className="h-[57px] w-full bg-muted rounded-md animate-pulse"
      />
    ))}
  </tr>
);
