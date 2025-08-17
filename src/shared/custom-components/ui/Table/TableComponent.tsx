import { Table } from "@tanstack/react-table";

import { useRef } from "react";

import { cn } from "@/shared/lib/utils";

import { DealBase } from "./model/types";
import TableTemplate from "./TableTemplate";

interface TableComponentProps<T extends DealBase> {
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

const TableComponent = <T extends DealBase>({
  table,
  hasEditDeleteActions = true,
  openFilters,
}: TableComponentProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={cn(
        "rounded-lg relative h-full overflow-auto border transition-all duration-200",
        {
          "max-h-[64vh]": openFilters,
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
      <TableTemplate
        table={table}
        tableContainerRef={tableContainerRef}
        hasEditDeleteActions={hasEditDeleteActions}
      />
    </div>
  );
};

export default TableComponent;
