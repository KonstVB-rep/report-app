import { DealType, StatusOrder } from "@prisma/client";
import { flexRender, Row, useReactTable } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { RefObject, useEffect, useState } from "react";

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
import DelOrderContextMenu from "@/entities/order/ui/DelOrderContextMenu";
import EditOrderContectMenu from "@/entities/order/ui/EditOrderContectMenu";
import DelTaskDialogContextMenu from "@/entities/task/ui/Modals/DelTaskDialogContextMenu";
import EditTaskDialogContextMenu from "@/entities/task/ui/Modals/EditTaskDialogContextMenu";

import ContextRowTable from "../ContextRowTable/ContextRowTable";
import RowInfoDialog from "./RowInfoDialog";
import { getRowClassName } from "./TableComponent";

type TableTemplateProps<T extends Record<string, unknown>> = {
  table: ReturnType<typeof useReactTable<T>>;
  className?: string;
  tableContainerRef: RefObject<HTMLDivElement | null>;
  hasEditDeleteActions?: boolean;
  entityType?: "deal" | "task" | "order";
};

const ROW_HEIGHT = 57;

const TableTemplate = <T extends Record<string, unknown>>({
  table,
  className,
  tableContainerRef,
  hasEditDeleteActions,
  entityType = 'deal',
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
        {rows.length > 0 && !isHydrating && (
          virtualItems.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <TableBodyRow
                key={row.id}
                row={row}
                virtualRow={virtualRow}
                hasEditDeleteActions={hasEditDeleteActions}
                entityType={entityType}
              />
            );
          })
        )}
      </TableBody>
    </table>
  );
};

type TableBodyRowProps<T> = {
  row: Row<T>;
  virtualRow: { index: number; start: number };
  hasEditDeleteActions?: boolean;
  entityType: string;
};

const TableBodyRow = <T extends Record<string, unknown>>({
  row,
  virtualRow,
  hasEditDeleteActions,
  entityType,
}: TableBodyRowProps<T>) => {
  const { departmentId } = useParams();
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null);

  const handleOpenInfo = (cellId: string) => {
    setOpenFullInfoCell(openFullInfoCell === cellId ? null : cellId);
  };
  if (entityType === "deal") {
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
        path={
          row.original.type
            ? `/dashboard/deal/${departmentId}/${(row.original.type as DealType).toLowerCase()}/${row.original.id}`
            : undefined
        }
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
              className="td td_inline-grid min-w-12 border-b border-r leading-none box-border min-h-[57px]"
              onDoubleClick={() => handleOpenInfo(cell.id)}
            >
              <span className="line-clamp-2 text-center text-sm">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
              {openFullInfoCell === cell.id && (
                <RowInfoDialog
                  isActive={true}
                  text={flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                  closeFn={() => setOpenFullInfoCell(null)}
                />
              )}
            </TableCell>
          ))}
        </TableRow>
      </ContextRowTable>
    );
  }

  if (entityType === "task") {
    return (
      <ContextRowTable
        key={row.id}
        modals={(setOpenModal) => ({
          edit: (
            <EditTaskDialogContextMenu
              close={() => setOpenModal(null)}
              id={row.original.id as string}
            />
          ),
          delete: (
            <DelTaskDialogContextMenu
              close={() => setOpenModal(null)}
              id={row.original.id as string}
            />
          ),
        })}
        path={`/tasks/${departmentId}/${row.original.assignerId}/${row.original.id}/`}
      >
        <TableRow
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualRow.start}px)`,
          }}
          className={`tr hover:bg-zinc-600 hover:text-white`}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              style={{ width: cell.column.getSize() }}
              className="td td_inline-grid min-w-12 border-b border-r leading-none box-border min-h-[57px]"
              onDoubleClick={() => handleOpenInfo(cell.id)}
            >
              <span className="line-clamp-2 text-center text-sm">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
              {openFullInfoCell === cell.id && (
                <RowInfoDialog
                  isActive={true}
                  text={flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                  closeFn={() => setOpenFullInfoCell(null)}
                />
              )}
            </TableCell>
          ))}
        </TableRow>
      </ContextRowTable>
    );
  }

  if (entityType === "order") {
    const isNotAtWork =
      row.original.orderStatus === StatusOrder.SUBMITTED_TO_WORK;
    const isAtWork = row.original.orderStatus === StatusOrder.AT_WORK;

    return (
      <ContextRowTable
        key={row.id}
        hasEditDeleteActions={hasEditDeleteActions}
        modals={(setOpenModal) => ({
          edit: (
            <EditOrderContectMenu
              close={() => setOpenModal(null)}
              id={row.original.id as string}
            />
          ),
          delete: (
            <DelOrderContextMenu
              close={() => setOpenModal(null)}
              id={row.original.id as string}
            />
          ),
        })}
      >
        <TableRow
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualRow.start}px)`,
          }}
          className={`tr hover:bg-zinc-600 hover:text-white ${isNotAtWork && "bg-red-900/40"} ${isAtWork && "bg-lime-200/20"}`}
          data-reject={`${isNotAtWork}`}
          data-success={`${isAtWork}`}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              style={{ width: cell.column.getSize() }}
              className="td td_inline-grid min-w-12 border-b border-r leading-none box-border min-h-[57px]"
              onDoubleClick={() => handleOpenInfo(cell.id)}
            >
              <span className="line-clamp-2 text-center text-sm">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
              {openFullInfoCell === cell.id && (
                <RowInfoDialog
                  isActive={true}
                  text={flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                  closeFn={() => setOpenFullInfoCell(null)}
                />
              )}
            </TableCell>
          ))}
        </TableRow>
      </ContextRowTable>
    );
  }
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
