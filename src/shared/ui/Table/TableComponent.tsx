import { DealType } from "@prisma/client";
import { flexRender, Row, useReactTable } from "@tanstack/react-table";

import { ReactNode, useCallback } from "react";

import { useParams } from "next/navigation";

import { TableCell, TableRow } from "@/components/ui/table";
import DelDealContextMenu from "@/entities/deal/ui/Modals/DelDealContextMenu";
import EditDealContextMenu from "@/entities/deal/ui/Modals/EditDealContextMenu";

import ContextRowTable from "../ContextRowTable/ContextRowTable";
import TableTemplate from "./TableTemplate";

type TableComponentProps<T> = {
  table: ReturnType<typeof useReactTable<T>>;
  getRowLink?: (row: T & { id: string }, type: string) => string;
  isExistActionDeal?: boolean;
};

const TableComponent = <T extends Record<string, unknown>>({
  table,
  isExistActionDeal = true,
}: TableComponentProps<T>) => {
  const { departmentId } = useParams();

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
          path={`/dashboard/deal/${departmentId}/${
                  (row.original.type as DealType).toLowerCase()}/${row.original.id}`}
        >
          <TableRow
            className={`tr hover:bg-zinc-600 hover:text-white ${row.original.dealStatus === "REJECT" && "bg-red-900/40"} ${row.original.dealStatus === "PAID" && "bg-lime-200/20"}`}
            data-reject={`${row.original.dealStatus === "REJECT"}`}
            data-success={`${row.original.dealStatus === "PAID"}`}
          >
            {renderRowCells(row)}
          </TableRow>
        </ContextRowTable>
      );
    },
    [isExistActionDeal, departmentId, renderRowCells]
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

export default TableComponent;
