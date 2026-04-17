import { flexRender, type Row, type Table } from "@tanstack/react-table";
import type { VirtualItem } from "@tanstack/react-virtual";
import { ArrowDownUp, MoveDown, MoveUp } from "lucide-react";
import React, { JSX, memo, useCallback, useMemo, useRef } from "react";

import type { DealUnion } from "@/entities/deal/types";
import { DealTableRow } from "@/entities/deal/ui/DealTableRow";
import { Button } from "@/shared/components/ui/button";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import useVirtualizedRowTable from "@/shared/hooks/useVirtualizedRowTable";
import { HEIGHT_ROW } from "@/shared/lib/constants";
import { cn } from "@/shared/lib/utils";
import VirtualRow from "./VirtualRow";

interface TableComponentProps<T extends DealUnion> {
  table: Table<T>;
  hasEditDeleteActions?: boolean;
  openFilters: boolean;
}

// 1. Мемоизируем тело, чтобы оно не знало о ресайзе (сравнение по ссылке данных и скролла)
const MemoizedTableBody = memo(
  function MemoizedTableBodyInner<T extends DealUnion>({
    totalSize,
    virtualItems,
    rows,
    renderVirtualRow,
  }: {
    totalSize: number;
    virtualItems: VirtualItem[];
    rows: Row<T>[];
    renderVirtualRow: (props: {
      row: Row<T>;
      virtualRow: VirtualItem;
    }) => React.ReactNode;
  }) {
    return (
      <TableBody
        style={{
          height: `${totalSize}px`,
          position: "relative",
          minHeight: `${HEIGHT_ROW}px`,
        }}
      >
        <VirtualRow
          renderRow={renderVirtualRow}
          rows={rows}
          virtualItems={virtualItems}
        />
      </TableBody>
    );
  },
  (prev, next) =>
    prev.totalSize === next.totalSize &&
    prev.rows === next.rows &&
    prev.virtualItems === next.virtualItems,
) as <T extends DealUnion>(props: {
  totalSize: number;
  virtualItems: VirtualItem[];
  rows: Row<T>[];
  renderVirtualRow: (props: {
    row: Row<T>;
    virtualRow: VirtualItem;
  }) => React.ReactNode;
}) => JSX.Element;

const TableComponent = <T extends DealUnion>({
  table,
  hasEditDeleteActions = true,
  openFilters,
}: TableComponentProps<T>) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const { rows } = table.getRowModel();

  const { virtualItems, totalSize } = useVirtualizedRowTable<T>({
    rows,
    tableContainerRef,
  });

  const headers = useMemo(() => table.getHeaderGroups()[0].headers, [table]);

  const renderVirtualRow = useCallback(
    ({ row, virtualRow }: { row: Row<T>; virtualRow: VirtualItem }) => (
      <DealTableRow<T>
        hasEditDeleteActions={hasEditDeleteActions}
        headers={headers}
        key={row.id}
        row={row}
        virtualRow={virtualRow}
      />
    ),
    [headers, hasEditDeleteActions],
  );

  const columnSizeVars = useMemo(() => {
    const allHeaders = table.getFlatHeaders();
    const colSizes: Record<string, number> = {};
    for (let i = 0; i < allHeaders.length; i++) {
      const header = allHeaders[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return (
    <div
      ref={tableContainerRef}
      className={cn(
        "rounded-lg relative h-full overflow-auto border transition-all duration-200",
        {
          "max-h-[68vh]": openFilters,
          "max-h-[75vh]": !openFilters,
        },
      )}
    >
      {rows.length > 0 ? (
        <table
          className="w-full grid border-separate border-spacing-0 border border-border"
          style={{ ...columnSizeVars, width: table.getTotalSize() }}
        >
          <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-800 rounded-t-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="flex w-fit" key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "p-2! border-zinc-600 border border-solid relative h-auto",
                      {
                        "rounded-tr-sm":
                          index === headerGroup.headers.length - 1,
                        "rounded-tl-sm": index === 0,
                      },
                    )}
                    style={{
                      width: `calc(var(--header-${header.id}-size) * 1px)`,
                      flex: "0 0 auto",
                      willChange: "width",
                    }}
                  >
                    {!header.isPlaceholder && (
                      <div
                        className={cn(
                          "grid content-between justify-items-center gap-1 h-full text-primary px-1",
                          // header.column.getCanSort() &&
                          //   "cursor-pointer select-none",
                        )}
                        // onClick={header.column.getToggleSortingHandler()}
                      >
                        <span className="text-xs font-semibold first-letter:capitalize text-center">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="flex justify-center"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {{
                              asc: <MoveUp className="ml-2 h-4 w-4" />,
                              desc: <MoveDown className="ml-2 h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowDownUp className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {header.column.getCanResize() && (
                          <div
                            onDoubleClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={cn(
                              "resizer",
                              header.column.getIsResizing() && "isResizing",
                            )}
                          />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <MemoizedTableBody<T>
            totalSize={totalSize}
            virtualItems={virtualItems}
            rows={rows}
            renderVirtualRow={renderVirtualRow}
          />
        </table>
      ) : (
        <div className="flex items-center justify-center h-20 bg-stone-700 text-white">
          Нет данных
        </div>
      )}
    </div>
  );
};

export default TableComponent;
