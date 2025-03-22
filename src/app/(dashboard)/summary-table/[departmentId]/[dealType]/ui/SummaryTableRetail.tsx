"use client";

import React from "react";

import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import { RetailResponse } from "@/entities/deal/types";
import DataTable from "@/shared/ui/Table/DataTable";
import { DealType, PermissionEnum } from "@prisma/client";
import { columnsDataRetailSummary } from "../[userId]/model/summary-columns-data-retail";
import { useGetAllRetails } from "@/entities/deal/hooks";
import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";

const SummaryTableRetail = ({ userId }: { userId: string }) => {
  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_UNION_REPORT
  );

  const {
    data: deals,
    error,
    isError,
  } = useGetAllRetails(hasAccess ? (userId as string) : null);

  const getRowLink = (row: RetailResponse & { id: string }, type: string) => {
    return `/deal/${type.toLowerCase()}/${row.id}`;
  };

  return (
    <DealTableTemplate>
      {isError && (
        <div className="grid h-full place-items-center">
          <h1 className="rounded-md bg-muted p-4 text-center text-xl">
            {error?.message}
          </h1>
        </div>
      )}
      {deals && (
        <>
          <DataTable
            columns={columnsDataRetailSummary}
            data={(deals as RetailResponse[]) ?? []}
            getRowLink={getRowLink}
            type={DealType.PROJECT}
          />
        </>
      )}
    </DealTableTemplate>
  );
};

export default SummaryTableRetail;
