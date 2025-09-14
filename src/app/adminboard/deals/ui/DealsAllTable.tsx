"use client";

import { Table } from "@tanstack/react-table";
import { Row } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";

import { RefObject } from "react";

import { DealBase } from "@/entities/deal/types";
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate";
import VirtualRow from "@/shared/custom-components/ui/Table/VirtualRow";

import DealsTableRow from "./DealsTableRow";

const DealsAllTable = ({
  table,
  rows,
  virtualItems,
  totalSize,
  openFullInfoCell,
  setOpenFullInfoCell,
  tableContainerRef,
}: {
  table: Table<DealBase>;
  rows: Row<DealBase>[];
  virtualItems: VirtualItem[];
  totalSize: number;
  openFullInfoCell: string | null;
  setOpenFullInfoCell: (id: string | null) => void;
  tableContainerRef: RefObject<HTMLDivElement | null>;
}) => {
  const headers = table.getHeaderGroups()[0].headers;

  return (
    <div
      className="rounded-lg relative h-full overflow-auto max-h-[78vh] border transition-all duration-200"
      ref={tableContainerRef}
    >
      <TableTemplate
        table={table}
        className="rounded-ee-md"
        totalSize={totalSize}
      >
        <VirtualRow
          rows={rows}
          virtualItems={virtualItems}
          renderRow={({ row, virtualRow }) => (
            <DealsTableRow
              row={row}
              virtualRow={virtualRow}
              headers={headers}
              openFullInfoCell={openFullInfoCell}
              setOpenFullInfoCell={setOpenFullInfoCell}
            />
          )}
        />
      </TableTemplate>
    </div>
  );
};

export default DealsAllTable;
