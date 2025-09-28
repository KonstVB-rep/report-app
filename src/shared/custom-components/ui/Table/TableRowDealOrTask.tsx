import { DealType } from "@prisma/client";
import { flexRender, Header, Row } from "@tanstack/react-table";

import { useState } from "react";

import { TableRow } from "@/shared/components/ui/table";
import {
  pageParamsSchemaDepsId,
  useTypedParams,
} from "@/shared/hooks/useTypedParams";

import ContextRowTable from "../ContextRowTable/ContextRowTable";
import { useTableContext } from "./context/TableContext";
import RowInfoDialog from "./RowInfoDialog";
import TableCellComponent from "./TableCellCompoment";

type TableRowDealOrTaskProps<T extends Record<string, unknown>> = {
  row: Row<T>;
  virtualRow: { index: number; start: number };
  hasEditDeleteActions?: boolean;
  entityType: string;
  headers?: Header<T, unknown>[];
};

export const getRowClassName = (dealStatus?: string) => {
  const baseClass = "tr hover:bg-zinc-600 hover:text-white relative";
  if (!dealStatus) return baseClass;

  return `${baseClass} ${
    dealStatus === "CLOSED"
      ? "bg-green-950/50 darK:bg-green-950/30 dark:opacity-60"
      : dealStatus === "REJECT"
        ? "bg-red-900/40 dark:bg-red-900/40 opacity-80 dark:opacity-60"
        : dealStatus === "PAID"
          ? "bg-green-100 dark:bg-lime-200/20"
          : ""
  }`;
};

const TableRowDealOrTask = <T extends Record<string, unknown>>({
  row,
  virtualRow,
  hasEditDeleteActions,
  entityType,
  headers,
}: TableRowDealOrTaskProps<T>) => {
  const { departmentId } = useTypedParams(pageParamsSchemaDepsId);
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
              <TableCellComponent<T>
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
            display: "flex",
          }}
          className={`tr hover:bg-zinc-600 hover:text-white`}
        >
          {row.getVisibleCells().map((cell, index) => (
            <TableCellComponent<T>
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
};

export default TableRowDealOrTask;
