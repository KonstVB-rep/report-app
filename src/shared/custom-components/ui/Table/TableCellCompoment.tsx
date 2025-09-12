import { TableCell } from "@/shared/components/ui/table";
import { Cell, flexRender } from "@tanstack/react-table";
import { CSSProperties } from "react";

type TableCellComponentProps<TData> = {
  cell: Cell<TData, unknown>;
  styles?: CSSProperties;
  handleOpenInfo?: (cellId: string) => void;
  children?: React.ReactNode;
  classNameSpan?: string;
};


const TableCellComponent = <TData,>({
  cell,
  styles,
  handleOpenInfo,
  children,
  classNameSpan = 'line-clamp-2 text-center text-sm'
}: TableCellComponentProps<TData>) => {
  return (
    <TableCell
      style={styles}
      className="p-2 td td_inline-grid flex-1 min-w-12 border-b border-r leading-none box-border min-h-[57px] relative overflow-hidden"
      onDoubleClick={() => handleOpenInfo?.(cell.id)}
    >
      <span className={classNameSpan}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </span>
      {children}
    </TableCell>
  );
};

export default TableCellComponent;