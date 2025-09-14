import { flexRender, Header, Row } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";

import { Fragment } from "react";

import { TableRow } from "@/shared/components/ui/table";
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog";
import TableCellComponent from "@/shared/custom-components/ui/Table/TableCellCompoment";

import { EventInputType } from "../../types";

interface EventTableRowProps {
  row: Row<EventInputType>;
  virtualRow: VirtualItem;
  headers: Header<EventInputType, unknown>[];
  openFullInfoCell: string | null;
  onOpenInfo: (rowId: string) => void;
  onCloseInfo: () => void;
}

const EventTableRow = ({
  row,
  virtualRow,
  headers,
  openFullInfoCell,
  onOpenInfo,
  onCloseInfo,
}: EventTableRowProps) => {
  return (
    <TableRow
      key={row.id}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        transform: `translateY(${virtualRow.start}px)`,
        display: "flex",
      }}
      onDoubleClick={() => onOpenInfo(row.original.id || "")}
    >
      <>
        {row.getVisibleCells().map((cell) => (
          <Fragment key={cell.id}>
            {openFullInfoCell === row.original.id && (
              <RowInfoDialog
                key={cell.id}
                isActive={true}
                text={flexRender(cell.column.columnDef.cell, cell.getContext())}
                isTargetCell={true}
                closeFn={onCloseInfo}
              />
            )}
          </Fragment>
        ))}

        {row.getVisibleCells().map((cell, index) => (
          <TableCellComponent<EventInputType>
            key={cell.id}
            styles={{
              width: headers?.[index]?.getSize(),
              minWidth: headers?.[index]?.column.columnDef.minSize,
              maxWidth: headers?.[index]?.column.columnDef.maxSize,
            }}
            cell={cell}
            handleOpenInfo={onOpenInfo}
          />
        ))}
      </>
    </TableRow>
  );
};

export default EventTableRow;
