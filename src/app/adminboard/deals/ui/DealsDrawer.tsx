import { DealType } from "@prisma/client";
import { Table } from "@tanstack/react-table";

import React from "react";

import { DealBase } from "@/entities/deal/types";
import DelButtonDeal from "@/feature/deals/ui/Modals/DelButtonDeal";
import DelButtonMultiDeals from "@/feature/deals/ui/Modals/DelButtonMultiDeals";
import DeleteDialog from "@/shared/custom-components/ui/DeleteDIalog";

import DialogReassignDealConfirm from "./DialogReassignDealConfirm";

const DealsDrawer = ({ table }: { table: Table<DealBase> }) => {
  const rowSelection = Object.keys(table.getState().rowSelection);

  if (!table || rowSelection.length === 0) {
    return null;
  }

  const { rows } = table.getRowModel();

  const rowsSelectionData = rows.filter((row) => row.id in rowSelection);
  const type = rowsSelectionData[0]?.original.type as DealType;
  const dealId = rowsSelectionData[0]?.original.id;
  const deals = rowsSelectionData.map((row) => {
    return {
      id: row.original.id,
      type: row.original.type as DealType,
      title: row.original.nameDeal,
    };
  });

  return (
    <>
      {rowSelection.length > 0 && (
        <div className="bg-stone-800/90 flex items-center justify-center gap-2 border absolute bottom-0 w-full h-20 rounded-t-md p-4 ">
          {rowSelection?.length === 1 && (
            <div>
              <DelButtonDeal type={type} id={dealId} isTextButton />
            </div>
          )}
          {rowSelection?.length > 1 && <DelButtonMultiDeals deals={deals} />}
          {rowSelection?.length > 0 && (
            <DialogReassignDealConfirm deals={deals} />
          )}
        </div>
      )}
    </>
  );
};

export default DealsDrawer;
