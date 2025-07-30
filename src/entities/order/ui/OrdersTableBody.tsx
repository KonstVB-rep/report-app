import { useReactTable } from "@tanstack/react-table";

import { useRef } from "react";

import { DealBase } from "@/shared/ui/Table/model/types";
import TableTemplate from "@/shared/ui/Table/TableTemplate";

type TableComponentProps<T extends DealBase> = {
  table: ReturnType<typeof useReactTable<T>>;
  getRowLink?: (row: T & { id: string }, type: string) => string;
  hasEditDeleteActions?: boolean;
  openFilters: boolean;
};

const OrdersTableBody = <T extends DealBase>({
  table,
  hasEditDeleteActions = true,
  openFilters,
}: TableComponentProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="rounded-lg overflow-hidden border transition-all duration-200"
      ref={tableContainerRef}
      style={{
        overflow: "auto",
        position: "relative",
        height: "100%",
        maxHeight: openFilters ? "69vh" : "78vh",
      }}
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
        entityType="order"
      />
    </div>
  );
};

export default OrdersTableBody;
