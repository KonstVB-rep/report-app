"use client";

import React from "react";
import { useParams } from "next/navigation";

import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import { RetailResponse } from "@/entities/deal/types";
import DataTable from "@/shared/ui/Table/DataTable";
import { DealType } from "@prisma/client";
import { columnsDataRetailSummary } from "../[userId]/model/summary-columns-data-retail";
import { useGetAllDealsByDepartmentByType } from "@/entities/deal/hooks";

const SummaryTableRetail = () => {
  const { userId } = useParams();

  const {
    data: dealsByType,
    error,
    isError,
  } = useGetAllDealsByDepartmentByType(userId as string, DealType.RETAIL);

  const getRowLink = (row: RetailResponse & { id: string }, type: string) => {
    return `/deal/${type.toLowerCase()}/${row.id}`;
  };

  return (
    <DealTableTemplate>
      {isError && (
        <div className="grid place-items-center h-full">
          <h1 className="text-xl text-center p-4 bg-muted rounded-md">
            {error?.message}
          </h1>
        </div>
      )}
      {dealsByType && (
        <>
          <DataTable
            columns={columnsDataRetailSummary}
            data={(dealsByType as RetailResponse[]) ?? []}
            getRowLink={getRowLink}
            type={DealType.PROJECT}
          />
        </>
      )}
    </DealTableTemplate>
  );
};

export default SummaryTableRetail;
