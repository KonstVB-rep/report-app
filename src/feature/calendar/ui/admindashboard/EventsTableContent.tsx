import { Row, Table } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";

import React, { useCallback, useMemo, useState } from "react";

import { TableCell } from "@/shared/components/ui/table";
import { SkeletonTable } from "@/shared/custom-components/ui/Skeletons/SkeletonTable";
import TableTemplate from "@/shared/custom-components/ui/Table/TableTemplate";
import VirtualRow from "@/shared/custom-components/ui/Table/VirtualRow";

import { EventInputType } from "../../types";
import EventTableRow from "./EventTableRow";

interface EventsTableTemplateProps {
  table: Table<EventInputType>;
  rows: Row<EventInputType>[];
  virtualItems: VirtualItem[];
  isLoading: boolean;
  totalSize: number;
}

const EventsTableContent = ({
  table,
  rows,
  virtualItems,
  isLoading,
  totalSize,
}: EventsTableTemplateProps) => {
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null);
  const headers = useMemo(() => table.getHeaderGroups()[0].headers, [table]);

  const handleOpenInfo = useCallback(
    (rowId: string) => {
      setOpenFullInfoCell(openFullInfoCell === rowId ? null : rowId);
    },
    [openFullInfoCell]
  );

  const handleCloseInfo = useCallback(() => {
    setOpenFullInfoCell(null);
  }, []);

  if (isLoading) {
    return <SkeletonTable className="p-1 w-full" innerTable={false} />;
  }

  return (
    <TableTemplate
      table={table}
      className="h-full max-h-[76vh] overflow-auto rounded-md"
      totalSize={totalSize || 57}
    >
      {table.getRowModel().rows.length > 0 ? (
        <VirtualRow
          rows={rows}
          virtualItems={virtualItems}
          renderRow={({ row, virtualRow }) => (
            <EventTableRow
              key={row.id}
              row={row}
              virtualRow={virtualRow}
              headers={headers}
              openFullInfoCell={openFullInfoCell}
              onOpenInfo={handleOpenInfo}
              onCloseInfo={handleCloseInfo}
            />
          )}
        />
      ) : (
        <tr className="flex items-center justify-center h-[57px]">
          <TableCell
            colSpan={headers.length}
            className="text-center h-full flex items-center justify-center text-sm uppercase"
          >
            Список событий календаря пуст
          </TableCell>
        </tr>
      )}
    </TableTemplate>
  );
};

export default EventsTableContent;
