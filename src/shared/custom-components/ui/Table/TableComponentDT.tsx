import { Row, Table } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";

import { useRef } from "react";

import useVirtualizedRowTable from "@/shared/hooks/useVirtualizedRowTable";
import { cn } from "@/shared/lib/utils";

import TableRowDealOrTask from "./TableRowDealOrTask";
import TableTemplate from "./TableTemplate";
import VirtualRow from "./VirtualRow";

interface TableComponentDTProps<T extends Record<string, unknown>> {
  table: Table<T>;
  getRowLink?: (row: T & { id: string }, type: string) => string;
  hasEditDeleteActions?: boolean;
  openFilters: boolean;
}

export const getRowClassName = (dealStatus?: string) => {
  const baseClass = "tr hover:bg-zinc-600 hover:text-white relative";
  if (!dealStatus) return baseClass;

  return `${baseClass} ${
    dealStatus === "CLOSED"
      ? "bg-green-950/30 opacity-60"
      : dealStatus === "REJECT"
        ? "bg-red-900/40 opacity-60"
        : dealStatus === "PAID"
          ? "bg-lime-200/20"
          : ""
  }`;
};

const TableComponentDT = <T extends Record<string, unknown>>({
  table,
  hasEditDeleteActions = true,
  openFilters,
}: TableComponentDTProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const { rows } = table.getRowModel();

  const { virtualItems, totalSize } = useVirtualizedRowTable<T>({
    rows,
    tableContainerRef,
  });

  return (
    <div
      className={cn(
        "rounded-lg relative h-full overflow-auto border transition-all duration-200",
        {
          "max-h-[68vh]": openFilters,
          "max-h-[75vh]": !openFilters,
        }
      )}
      ref={tableContainerRef}
    >
      {table.getRowModel().rows.length > 0 && (
        <p className="border rounded-md px-2 py-1 m-1 w-fit bg-stone-700 text-white dark:bg-black">
          Количество выбранных заявок: {table.getRowModel().rows.length}
        </p>
      )}
      {table.getRowModel().rows.length > 0 ? (
        <TableTemplate table={table} totalSize={totalSize}>
          <VirtualRow
            rows={rows}
            virtualItems={virtualItems}
            renderRow={({
              row,
              virtualRow,
            }: {
              row: Row<T>;
              virtualRow: VirtualItem;
            }) => (
              <TableRowDealOrTask<T>
                key={row.id}
                row={row}
                virtualRow={virtualRow}
                hasEditDeleteActions={hasEditDeleteActions}
                entityType={"deal"}
                headers={table.getHeaderGroups()[0].headers}
              />
            )}
          />
        </TableTemplate>
      ) : (
        <p className="border rounded-md flex items-center justify-center w-full px-2 py-1 bg-stone-700 text-white dark:bg-black">
          Нет данных
        </p>
      )}
    </div>
  );
};

export default TableComponentDT;
