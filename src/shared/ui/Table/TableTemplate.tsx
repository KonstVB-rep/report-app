import { DealType } from "@prisma/client";
import { flexRender, Row, useReactTable } from "@tanstack/react-table";
import {
  useVirtualizer,
  VirtualItem,
  Virtualizer,
} from "@tanstack/react-virtual";
import React, { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DelDealContextMenu from "@/entities/deal/ui/Modals/DelDealContextMenu";
import EditDealContextMenu from "@/entities/deal/ui/Modals/EditDealContextMenu";
import ContextRowTable from "../ContextRowTable/ContextRowTable";
import RowInfoDialog from "./RowInfoDialog";
import { getRowClassName } from "./TableComponent";
import { DealBase } from "./model/types";


type TableTemplateProps<T extends DealBase> = {
  table: ReturnType<typeof useReactTable<T>>;
  // renderRow: (row: Row<T>) => ReactNode;
  className?: string;
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
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

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })



  return (
    <table 
    className={`w-full grid border-separate border-spacing-0 border ${className}`}
    >
      <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-800">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} style={{ display: "flex", width: "100%" }}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                style={{
                  display: "flex",
                  position: "relative",
                  width: header.getSize(),
                  minWidth: header.column.columnDef.minSize,
                }}
                colSpan={header.colSpan}
                className="border-r border-zinc-600 !p-2"
              >
                {header.isPlaceholder ? null : (
                  <div
                    className={header.column.getCanSort()
                      ? "cursor-pointer select-none flex items-center text-center justify-center w-full gap-1 h-full text-primary"
                      : "flex items-center justify-center h-full w-full text-center text-primary"}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="text-start text-xs font-semibold first-letter:capitalize">
                      {flexRender(header.column.columnDef.header, header.getContext())}
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

      <TableBody
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {table.getRowModel().rows.length > 0 ? (
          rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <TableBodyRow
              key={virtualRow.index}
              row={rows[virtualRow.index]}
              virtualRow={virtualRow}
              rowVirtualizer={rowVirtualizer}
              hasEditDeleteActions={hasEditDeleteActions}
            />
          ))
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
  virtualRow: VirtualItem;
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  hasEditDeleteActions: boolean;
};

const TableBodyRow = <T extends DealBase>({
  row,
  virtualRow,
  rowVirtualizer,
  hasEditDeleteActions,
}: TableBodyRowProps<T>) => {
  const rowRef = useRef<HTMLTableRowElement>(null);
  const { departmentId } = useParams();
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null);



  const handleOpenInfo = (cellId: string) => {
    setOpenFullInfoCell(openFullInfoCell === cellId ? null : cellId);
  };

  return (
    <ContextRowTable
      key={row.id}
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
          data-index={virtualRow.index} //needed for dynamic row height measurement
        ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
          style={{
        position: 'absolute',
        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
      }}
        className={getRowClassName(row.original.dealStatus as string)}
        data-reject={`${row.original.dealStatus === "REJECT"}`}
        data-success={`${row.original.dealStatus === "PAID"}`}
        data-closed={`${row.original.dealStatus === "CLOSED"}`}
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
                isActive={!!openFullInfoCell}
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