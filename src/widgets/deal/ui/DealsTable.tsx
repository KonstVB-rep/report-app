import { DealType } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";

import React from "react";
import { useCallback } from "react";

import { useParams } from "next/navigation";

import AdditionalContacts from "@/feature/deals/ui/AdditionalContacts";
import AddNewDeal from "@/feature/deals/ui/Modals/AddNewDeal";
import DelDealContextMenu from "@/feature/deals/ui/Modals/DelDealContextMenu";
import EditDealContextMenu from "@/feature/deals/ui/Modals/EditDealContextMenu";
import {
  TableContextType,
  TableProvider,
} from "@/shared/custom-components/ui/Table/context/TableContext";
import { DealBase } from "@/shared/custom-components/ui/Table/model/types";
import DataTable from "@/widgets/DataTable/ui/DataTable";

interface DealsTableProps<T extends DealBase> {
  columns: ColumnDef<T>[];
  data: T[];
  hasEditDeleteActions?: boolean;
}

const DealsTable = <T extends DealBase>(props: DealsTableProps<T>) => {
  const { dealType } = useParams<{ dealType: string }>();

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
      []
    );

  return (
    <TableProvider<T>
      getContextMenuActions={getContextMenuActions}
      renderAdditionalInfo={(dealId: string) => (
        <AdditionalContacts dealId={dealId} />
      )}
    >
      <DataTable {...props}>
        <AddNewDeal type={dealType} />
      </DataTable>
    </TableProvider>
  );
};

export default DealsTable;
