import { DealType } from "@prisma/client";
import { Cell, flexRender, Header, Row } from "@tanstack/react-table";

import { CSSProperties, useState } from "react";

import { useParams } from "next/navigation";

import { TableCell, TableRow } from "@/shared/components/ui/table";

import ContextRowTable from "../ContextRowTable/ContextRowTable";
import { useTableContext } from "./context/TableContext";
import RowInfoDialog from "./RowInfoDialog";
import { getRowClassName } from "./TableComponent";

type TableBodyRowProps<T extends Record<string, unknown>> = {
  row: Row<T>;
  virtualRow: { index: number; start: number };
  hasEditDeleteActions?: boolean;
  entityType: string;
  headers?: Header<T, unknown>[];
};

type TableCellComponentProps<TData> = {
  cell: Cell<TData, unknown>;
  styles?: CSSProperties;
  handleOpenInfo: (cellId: string) => void;
  children?: React.ReactNode;
};

const TableCellComponent = <TData,>({
  cell,
  styles,
  handleOpenInfo,
  children,
}: TableCellComponentProps<TData>) => {
  return (
    <TableCell
      style={styles}
      className="td td_inline-grid flex-1 min-w-12 border-b border-r leading-none box-border min-h-[57px] relative overflow-hidden"
      onDoubleClick={() => handleOpenInfo(cell.id)}
    >
      <span className="line-clamp-2 text-center text-sm">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </span>
      {children}
    </TableCell>
  );
};

const TableBodyRow = <T extends Record<string, unknown>>({
  row,
  virtualRow,
  hasEditDeleteActions,
  entityType,
  headers,
}: TableBodyRowProps<T>) => {
  const { departmentId } = useParams();
  const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null);

  const { getContextMenuActions, renderAdditionalInfo } = useTableContext<T>();

  const handleOpenInfo = (cellId: string) => {
    setOpenFullInfoCell(openFullInfoCell === cellId ? null : cellId);
  };

  if (entityType === "deal") {
    return (
      <ContextRowTable
        hasEditDeleteActions={hasEditDeleteActions}
        modals={
          getContextMenuActions
            ? (setOpenModal) => getContextMenuActions(setOpenModal, row)
            : undefined
        }
        path={
          row.original.type
            ? `/dashboard/deal/${departmentId}/${(row.original.type as DealType).toLowerCase()}/${row.original.id}`
            : undefined
        }
      >
        <TableRow
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualRow.start}px)`,
            display: "flex",
          }}
          className={getRowClassName(row.original.dealStatus as string)}
          data-reject={row.original.dealStatus === "REJECT"}
          data-success={row.original.dealStatus === "PAID"}
          data-closed={row.original.dealStatus === "CLOSED"}
        >
          {row.getVisibleCells().map((cell, index) => {
            return (
              <TableCellComponent<T> // Явно передаем тип T
                key={cell.id}
                styles={{
                  width: headers?.[index]?.getSize(),
                  minWidth: headers?.[index]?.column.columnDef.minSize,
                  maxWidth: headers?.[index]?.column.columnDef.maxSize,
                }}
                cell={cell}
                handleOpenInfo={handleOpenInfo}
              >
                {openFullInfoCell === cell.id && (
                  <RowInfoDialog
                    isActive={true}
                    text={flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                    isTargetCell={cell.column.id === "contact"}
                    closeFn={() => setOpenFullInfoCell(null)}
                  >
                    {renderAdditionalInfo?.(row.original.id as string)}
                  </RowInfoDialog>
                )}
              </TableCellComponent>
            );
          })}
        </TableRow>
      </ContextRowTable>
    );
  }

  if (entityType === "task") {
    return (
      <ContextRowTable
        key={row.id}
        modals={
          getContextMenuActions
            ? (setOpenModal) => getContextMenuActions(setOpenModal, row)
            : undefined
        }
        path={`/dashboard/tasks/${departmentId}/${row.original.assignerId}/${row.original.id}/`}
      >
        <TableRow
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualRow.start}px)`,
            display: "flex", // Добавьте display: flex
          }}
          className={`tr hover:bg-zinc-600 hover:text-white`}
        >
          {row.getVisibleCells().map((cell, index) => (
            <TableCellComponent<T> // Явно передаем тип T
              key={cell.id}
              styles={{
                width: headers?.[index]?.getSize(),
                minWidth: headers?.[index]?.column.columnDef.minSize,
                maxWidth: headers?.[index]?.column.columnDef.maxSize,
              }}
              cell={cell}
              handleOpenInfo={handleOpenInfo}
            >
              {openFullInfoCell === cell.id && (
                <RowInfoDialog
                  isActive={true}
                  text={flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                  closeFn={() => setOpenFullInfoCell(null)}
                />
              )}
            </TableCellComponent>
          ))}
        </TableRow>
      </ContextRowTable>
    );
  }

  // if (entityType === "order") {
  //   const isNotAtWork =
  //     row.original.orderStatus === StatusOrder.SUBMITTED_TO_WORK;
  //   const isAtWork = row.original.orderStatus === StatusOrder.AT_WORK;

  //   return (
  //     <ContextRowTable
  //       key={row.id}
  //       hasEditDeleteActions={hasEditDeleteActions}
  //       modals={(setOpenModal) => ({
  //         edit: (
  //           <EditOrderContectMenu
  //             close={() => setOpenModal(null)}
  //             id={row.original.id as string}
  //           />
  //         ),
  //         delete: (
  //           <DelOrderContextMenu
  //             close={() => setOpenModal(null)}
  //             id={row.original.id as string}
  //           />
  //         ),
  //       })}
  //     >
  //       <TableRow
  //         style={{
  //           position: "absolute",
  //           top: 0,
  //           left: 0,
  //           width: "100%",
  //           transform: `translateY(${virtualRow.start}px)`,
  //         }}
  //         className={`tr hover:bg-zinc-600 hover:text-white ${isNotAtWork && "bg-red-900/40"} ${isAtWork && "bg-lime-200/20"}`}
  //         data-reject={`${isNotAtWork}`}
  //         data-success={`${isAtWork}`}
  //       >
  //         {row.getVisibleCells().map((cell) => (
  //           <TableCell
  //             key={cell.id}
  //             style={{ width: cell.column.getSize() }}
  //             className="td td_inline-grid min-w-12 border-b border-r leading-none box-border min-h-[57px]"
  //             onDoubleClick={() => handleOpenInfo(cell.id)}
  //           >
  //             <span className="line-clamp-2 text-center text-sm">
  //               {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //             </span>
  //             {openFullInfoCell === cell.id && (
  //               <RowInfoDialog
  //                 isActive={true}
  //                 text={flexRender(
  //                   cell.column.columnDef.cell,
  //                   cell.getContext()
  //                 )}
  //                 closeFn={() => setOpenFullInfoCell(null)}
  //               />
  //             )}
  //           </TableCell>
  //         ))}
  //       </TableRow>
  //     </ContextRowTable>
  //   );
  // }
};

export default TableBodyRow;
