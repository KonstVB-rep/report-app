"use client";

import { Table } from "@tanstack/react-table";
import { Row } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";

import { RefObject } from "react";

import { DealBase } from "@/entities/deal/types";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate";
import VirtualRow from "@/shared/custom-components/ui/Table/VirtualRow";
import { cn } from "@/shared/lib/utils";

import DealsTableRow from "./DealsTableRow";

type Props = {
  table: Table<DealBase>;
  rows: Row<DealBase>[];
  virtualItems: VirtualItem[];
  totalSize: number;
  openFullInfoCell: string | null;
  setOpenFullInfoCell: (id: string | null) => void;
  tableContainerRef: RefObject<HTMLDivElement | null>;
  openFilters: boolean;
};

const DealsAllTable = ({
  table,
  rows,
  virtualItems,
  totalSize,
  openFullInfoCell,
  setOpenFullInfoCell,
  tableContainerRef,
  openFilters,
}: Props) => {
  const headers = table.getHeaderGroups()[0].headers;

  return (
    <div
      className={cn(
        "rounded-lg relative h-full overflow-auto border transition-all duration-200",
        {
          "max-h-[66vh]": openFilters,
          "max-h-[74vh]": !openFilters,
        }
      )}
      ref={tableContainerRef}
    >
      {table.getRowModel().rows.length > 0 && (
        <p className="border rounded-md px-2 py-1 m-1 w-fit bg-stone-700 text-white dark:bg-black">
          Количество выбранных заявок: {table.getRowModel().rows.length}
        </p>
      )}
      <TableTemplate table={table} className="rounded-md" totalSize={totalSize}>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow className="flex items-center justify-center w-full h-full">
            <TableCell>Данные не найдены</TableCell>
          </TableRow>
        ) : (
          <VirtualRow
            rows={rows}
            virtualItems={virtualItems}
            renderRow={({ row, virtualRow }) => (
              <DealsTableRow
                key={row.id}
                row={row}
                virtualRow={virtualRow}
                headers={headers}
                openFullInfoCell={openFullInfoCell}
                setOpenFullInfoCell={setOpenFullInfoCell}
              />
            )}
          />
        )}
      </TableTemplate>
    </div>
  );
};

export default DealsAllTable;
