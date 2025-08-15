import { useReactTable } from "@tanstack/react-table";

import { useRef } from "react";

import { DealBase } from "@/shared/custom-components/ui/Table/model/types";
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate";
import { cn } from "@/shared/lib/utils";

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
        entityType="order"
      />
    </div>
  );
};

export default OrdersTableBody;
