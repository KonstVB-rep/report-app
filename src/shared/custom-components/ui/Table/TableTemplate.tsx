import { flexRender, useReactTable } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { RefObject, useEffect, useState } from "react";

import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react";

import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import TableBodyRow from "./TableBodyRow";

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
  entityType = "deal",
}: TableTemplateProps<T>) => {
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT,
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
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
                  maxWidth: header.column.columnDef.maxSize,
                }}
                data-size={header.getSize()}
                className="border-r border-zinc-600 !p-2 flex-1"
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
        {rows.length > 0 &&
          !isHydrating &&
          virtualItems.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <TableBodyRow<T>
                key={row.id}
                row={row}
                virtualRow={virtualRow}
                hasEditDeleteActions={hasEditDeleteActions}
                entityType={entityType}
                headers={table.getHeaderGroups()[0].headers}

              />
            );
          })}
      </TableBody>
    </table>
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
