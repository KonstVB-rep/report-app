import { StatusOrder } from "@prisma/client";
import { flexRender, Row, useReactTable } from "@tanstack/react-table";

import { ReactNode, useCallback } from "react";

import { TableCell, TableRow } from "@/components/ui/table";
import ContextRowTable from "@/shared/ui/ContextRowTable/ContextRowTable";
import TableTemplate from "@/shared/ui/Table/TableTemplate";

import DelOrderContextMenu from "./DelOrderContextMenu";
import EditOrderContectMenu from "./EditOrderContectMenu";

type TableComponentProps<T> = {
  table: ReturnType<typeof useReactTable<T>>;
  getRowLink?: (row: T & { id: string }, type: string) => string;
  hasEditDeleteActions?: boolean;
};

const OrdersTableBody = <T extends Record<string, unknown>>({
  table,
  hasEditDeleteActions = true,
}: TableComponentProps<T>) => {
  const rowCount = table.getRowModel().rows.length;
  const hasRows = rowCount > 0;

  const renderRowCells = useCallback((row: Row<T>) => {
    return row.getVisibleCells().map((cell) => (
      <TableCell
        key={cell.id}
        className="td min-w-12 border-b border-r"
        style={{ width: cell.column.getSize() }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ));
  }, []);

  const renderRow = useCallback(
    (row: Row<T>): ReactNode => {
      const isNotAtWork =
        row.original.orderStatus === StatusOrder.SUBMITTED_TO_WORK;
      const isAtWork = row.original.orderStatus === StatusOrder.AT_WORK;

      const tableRow = (
        <TableRow
          key={row.id}
          className={`tr hover:bg-zinc-600 hover:text-white ${isNotAtWork && "bg-red-900/40"} ${isAtWork && "bg-lime-200/20"}`}
          data-reject={`${isNotAtWork}`}
          data-success={`${isAtWork}`}
        >
          {renderRowCells(row)}
        </TableRow>
      );

      if (!isNotAtWork) {
        return tableRow;
      }
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
          // path={`/deal/${departmentId}/${
          //         (row.original.type as DealType).toLowerCase()}/${row.original.id}`}
        >
          {tableRow}
        </ContextRowTable>
      );
    },
    [hasEditDeleteActions, renderRowCells]
  );

  return (
    <div className="rounded-lg overflow-hidden border">
      {hasRows && (
        <p className="border rounded-md px-2 py-1 m-1 w-fit bg-stone-700 text-white dark:bg-black">
          Количество выбранных заявок: {rowCount}
        </p>
      )}
      <TableTemplate table={table} renderRow={renderRow} />
    </div>
  );
};

export default OrdersTableBody;
