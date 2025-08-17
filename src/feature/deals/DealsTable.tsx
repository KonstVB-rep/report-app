import { DealType } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";

import React from "react";
import { useCallback } from "react";

import { useParams } from "next/navigation";

import AddNewDeal from "@/entities/deal/ui/Modals/AddNewDeal";
import DelDealContextMenu from "@/entities/deal/ui/Modals/DelDealContextMenu";
import EditDealContextMenu from "@/entities/deal/ui/Modals/EditDealContextMenu";
import {
  TableContextType,
  TableProvider,
} from "@/shared/custom-components/ui/Table/context/TableContext";
import DataTable from "@/shared/custom-components/ui/Table/DataTable";
import { DealBase } from "@/shared/custom-components/ui/Table/model/types";

interface DealsTableProps<T extends DealBase> {
  columns: ColumnDef<T>[];
  data: T[];
  hasEditDeleteActions?: boolean;
}

const DealsTable = <T extends DealBase>(props: DealsTableProps<T>) => {
  const { dealType } = useParams<{ dealType: string }>();

  // Мемоизируем функцию создания контекстного меню
  const getContextMenuActions: TableContextType<T>["getContextMenuActions"] =
    useCallback(
      (
        setOpenModal: React.Dispatch<
          React.SetStateAction<"delete" | "edit" | null>
        >,
        row: Row<T>
      ) => ({
        edit: (
          <EditDealContextMenu
            close={() => setOpenModal(null)}
            id={row.original.id as string}
            type={row.original.type as DealType}
          />
        ),
        delete: (
          <DelDealContextMenu
            close={() => setOpenModal(null)}
            id={row.original.id as string}
            type={row.original.type as DealType}
          />
        ),
      }),
      [] // Зависимости, если нужны
    );

  return (
    <TableProvider<T> getContextMenuActions={getContextMenuActions}>
      <DataTable {...props}>
        <AddNewDeal type={dealType} />
      </DataTable>
    </TableProvider>
  );
};

export default DealsTable;
