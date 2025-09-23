"use client";

import { flexRender, Header, Row } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";

import { DealBase } from "@/entities/deal/types";
import { TableRow } from "@/shared/components/ui/table";
import RowInfoDialog from "@/shared/custom-components/ui/Table/RowInfoDialog";
import TableCellComponent from "@/shared/custom-components/ui/Table/TableCellCompoment";

const DealsTableRow = ({
  row,
  virtualRow,
  headers,
  openFullInfoCell,
  setOpenFullInfoCell,
}: {
  row: Row<DealBase>;
  virtualRow: VirtualItem;
  headers: Header<DealBase, unknown>[];
  openFullInfoCell: string | null;
  setOpenFullInfoCell: (id: string | null) => void;
}) => (
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
  >
    {row.getVisibleCells().map((cell, index) => (
      <TableCellComponent<DealBase>
        key={cell.id}
        styles={{
          width: headers?.[index]?.getSize(),
          minWidth: headers?.[index]?.column.columnDef.minSize,
          maxWidth: headers?.[index]?.column.columnDef.maxSize,
        }}
        cell={cell}
        handleOpenInfo={(id) =>
          setOpenFullInfoCell(openFullInfoCell === id ? null : id)
        }
      >
        {openFullInfoCell === cell.id && (
          <RowInfoDialog
            isActive
            text={flexRender(cell.column.columnDef.cell, cell.getContext())}
            isTargetCell={true}
            closeFn={() => setOpenFullInfoCell(null)}
          />
        )}
      </TableCellComponent>
    ))}
  </TableRow>
);

export default DealsTableRow;
