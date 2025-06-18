import { StatusOrder } from "@prisma/client";
import { flexRender, Row, useReactTable } from "@tanstack/react-table";

import { ReactNode, useCallback } from "react";

// import { useParams } from "next/navigation";

import { TableCell, TableRow } from "@/components/ui/table";
// import EditDealContextMenu from "@/entities/deal/ui/Modals/EditDealContextMenu";

import ContextRowTable from "@/shared/ui/ContextRowTable/ContextRowTable";
import TableTemplate from "@/shared/ui/Table/TableTemplate";
import DelOrderContextMenu from "./DelOrderContextMenu";
import EditOrderContectMenu from "./EditOrderContectMenu";


type TableComponentProps<T> = {
  table: ReturnType<typeof useReactTable<T>>;
  getRowLink?: (row: T & { id: string }, type: string) => string;
  isExistActionDeal?: boolean;
};

const OrdersTableBody = <T extends Record<string, unknown>>({
  table,
  isExistActionDeal = true,
}: TableComponentProps<T>) => {
  // const { departmentId } = useParams();

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
      return (
        <ContextRowTable
          key={row.id}
          isExistActionDeal={isExistActionDeal}
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
          <TableRow
            className={`tr hover:bg-zinc-600 hover:text-white ${row.original.orderStatus === StatusOrder.SUBMITTED_TO_WORK && "bg-red-900/40"} ${row.original.orderStatus === StatusOrder.AT_WORK && "bg-lime-200/20"}`}
            data-reject={`${row.original.orderStatus === StatusOrder.SUBMITTED_TO_WORK}`}
            data-success={`${row.original.orderStatus === StatusOrder.AT_WORK}`}
          >
            {renderRowCells(row)}
          </TableRow>
        </ContextRowTable>
      );
    },
    [isExistActionDeal, renderRowCells]
  );

  return (
    <div className="rounded-lg overflow-hidden border">
      {table.getRowModel().rows.length > 0 && (
        <p className="border rounded-md px-2 py-1 m-1 w-fit bg-stone-700 text-white dark:bg-black">
          Количество выбранных заявок: {table.getRowModel().rows.length}
        </p>
      )}
      <TableTemplate table={table} renderRow={renderRow} />
    </div>
  );
};

export default OrdersTableBody;
