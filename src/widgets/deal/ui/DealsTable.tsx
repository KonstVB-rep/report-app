import { DealType } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";

import React from "react";
import { useCallback } from "react";

import { useParams } from "next/navigation";

import z from "zod";

import {
  DealTypesArray,
  TableTypes,
  TableTypesWithContracts,
} from "@/entities/deal/lib/constants";
import AdditionalContacts from "@/feature/deals/ui/AdditionalContacts";
import AddNewDeal from "@/feature/deals/ui/Modals/AddNewDeal";
import DelDealContextMenu from "@/feature/deals/ui/Modals/DelDealContextMenu";
import EditDealContextMenu from "@/feature/deals/ui/Modals/EditDealContextMenu";
import {
  TableContextType,
  TableProvider,
} from "@/shared/custom-components/ui/Table/context/TableContext";
import { TypeBaseDT } from "@/shared/custom-components/ui/Table/model/types";
import { useTypedParams } from "@/shared/hooks/useTypedParams";
import DataTable from "@/widgets/DataTable/ui/DataTable";

interface DealsTableProps<T extends TypeBaseDT> {
  columns: ColumnDef<T>[];
  data: T[];
  hasEditDeleteActions?: boolean;
}

const pageParamsSchema = z.object({
  dealType: z.enum(TableTypesWithContracts),
});

const DealsTable = <T extends TypeBaseDT>(props: DealsTableProps<T>) => {
  const { dealType } = useTypedParams(pageParamsSchema);

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
