import { DealType } from "@prisma/client";
import { flexRender, Row, useReactTable } from "@tanstack/react-table";

import { Fragment, ReactNode, useRef, useState } from "react";

import { useParams } from "next/navigation";

import { TableCell, TableRow } from "@/components/ui/table";
import DelDealContextMenu from "@/entities/deal/ui/Modals/DelDealContextMenu";
import EditDealContextMenu from "@/entities/deal/ui/Modals/EditDealContextMenu";

import ContextRowTable from "../ContextRowTable/ContextRowTable";
import RowInfoDialog from "./RowInfoDialog";
import TableTemplate from "./TableTemplate";
import { DealBase } from "./model/types";

type TableComponentProps<T extends DealBase> = {
  table: ReturnType<typeof useReactTable<T>>;
  getRowLink?: (row: T & { id: string }, type: string) => string;
  hasEditDeleteActions?: boolean;
};

export const getRowClassName = (dealStatus?: string) => {
  const baseClass = "tr hover:bg-zinc-600 hover:text-white relative";
  if (!dealStatus) return baseClass;

  return `${baseClass} ${
    dealStatus === "CLOSED"
      ? "bg-green-950/80"
      : dealStatus === "REJECT"
        ? "bg-red-900/40 opacity-60"
        : dealStatus === "PAID"
          ? "bg-lime-200/20"
          : ""
  }`;
};

const TableComponent = <T extends DealBase>({
  table,
  hasEditDeleteActions = true,
}: TableComponentProps<T>) => {
  // const { departmentId } = useParams();
  // const [openFullInfoCell, setOpenFullInfoCell] = useState<string | null>(null); // Храним состояние для каждой ячейки
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  // const handleOpenInfo = (cellId: string) => {
  //   if (openFullInfoCell === cellId) {
  //     // Если окно уже открыто для этой ячейки, закрываем его
  //     setOpenFullInfoCell(null);
  //   } else {
  //     // Открываем окно для этой ячейки
  //     setOpenFullInfoCell(cellId);
  //   }
  // };

  // const renderRow = (row: Row<T>): ReactNode => {
  //   return (
  //     <ContextRowTable
  //       key={row.id}
  //       hasEditDeleteActions={hasEditDeleteActions}
  //       modals={(setOpenModal) => ({
  //         edit: (
  //           <EditDealContextMenu
  //             close={() => setOpenModal(null)}
  //             id={row.original.id as string}
  //             type={row.original.type as DealType}
  //           />
  //         ),
  //         delete: (
  //           <DelDealContextMenu
  //             close={() => setOpenModal(null)}
  //             id={row.original.id as string}
  //             type={row.original.type as DealType}
  //           />
  //         ),
  //       })}
  //       path={`/dashboard/deal/${departmentId}/${(
  //         row.original.type as DealType
  //       ).toLowerCase()}/${row.original.id}`}
  //     >
  //       <TableRow
  //         className={getRowClassName(row.original.dealStatus as string)}
  //         data-reject={`${row.original.dealStatus === "REJECT"}`}
  //         data-success={`${row.original.dealStatus === "PAID"}`}
  //         data-closed={`${row.original.dealStatus === "CLOSED"}`}
  //       >
  //         {row.getVisibleCells().map((cell) => (
  //           <TableCell
  //             key={cell.id}
  //             className="td min-w-12 border-b border-r"
  //             style={{ width: cell.column.getSize() }}
  //             onDoubleClick={() => handleOpenInfo(cell.id)} // При двойном клике открываем только для этой ячейки
  //           >
  //             <span className="line-clamp-2 text-center">
  //               {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //             </span>

  //             {openFullInfoCell === cell.id && (
  //               <RowInfoDialog
  //                 isActive={!!openFullInfoCell}
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
  // };

  return (
    <div
  className="rounded-lg overflow-hidden border"
  ref={tableContainerRef}
  style={{
    overflow: "auto",
    position: "relative",
    height: "100%", // или подходящая высота для вашего контейнера
    maxHeight: "78vh"
  }}
>
      {table.getRowModel().rows.length > 0 && (
        <p className="border rounded-md px-2 py-1 m-1 w-fit bg-stone-700 text-white dark:bg-black">
          Количество выбранных заявок: {table.getRowModel().rows.length}
        </p>
      )}
      <TableTemplate
        table={table}
        // renderRow={renderRow}
        tableContainerRef={tableContainerRef}
        hasEditDeleteActions={hasEditDeleteActions}
      />
    </div>
  );
};

export default TableComponent;
