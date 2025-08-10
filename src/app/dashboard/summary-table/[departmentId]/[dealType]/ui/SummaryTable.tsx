"use client";

import { PermissionEnum } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import React, { JSX, useMemo } from "react";

import dynamic from "next/dynamic";

import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import ErrorMessageTable from "@/entities/deal/ui/ErrorMessageTable";
import LinkToUserTable from "@/entities/deal/ui/LinkToUserTable";
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton";
import { useGetAllDeals } from "@/entities/deal/hooks/query";
import { hasAccessToDataSummary } from "@/entities/deal/lib/hasAccessToData";
import AccessDeniedMessage from "@/shared/ui/AccessDeniedMessage";
import { useParams } from "next/navigation";
import Loading from "../[userId]/loading";
import { DealBase } from "@/shared/ui/Table/model/types";
import { DealsUnionType, ProjectResponse, RetailResponse } from "@/entities/deal/types";
import { columnsDataProjectSummary } from "../[userId]/model/summary-columns-data-project";
import { columnsDataRetailSummary } from "../[userId]/model/summary-columns-data-retail";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";


const Columns = (type: DealsUnionType): ColumnDef<ProjectResponse, unknown>[] | ColumnDef<RetailResponse, unknown>[] => {
  switch (type) {
    case 'projects':
      return columnsDataProjectSummary;
    case 'retails':
      return columnsDataRetailSummary;
    default:
      throw new Error(`Unknown table type: ${type}`);
  }
};

const DataTable = dynamic(() => import("@/shared/ui/Table/DataTable"), {
  ssr: false,
  loading: () => <TableRowsSkeleton />,
}) as <T extends { id: string }>(props: {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  hasEditDeleteActions: boolean;
}) => JSX.Element;

export interface SummaryTableProps<TData extends { id: string }> {
  columns: ColumnDef<TData, unknown>[];
}

const SummaryTable=() => {

    const { userId, departmentId, dealType } = useParams<{
      userId: string;
      departmentId: string;
      dealType: 'projects' | 'retails'
    }>();
  
    const hasAccess = useMemo(
      () =>
        userId
          ? hasAccessToDataSummary(
              userId as string,
              PermissionEnum.VIEW_UNION_REPORT
            )
          : false,
      [userId]
    );
  
    const {
      data: deals,
      error,
      isError,
      isPending,
    } = useGetAllDeals(dealType,hasAccess ? userId : null, departmentId);
  
  
    if (!hasAccess) {
      return (
        <AccessDeniedMessage
          error={{ message: "у вас нет доступа к этому разделу" }}
        />
      );
    }
  
    if (isPending) return <Loading />;


  return (
    <DealTableTemplate>
      {isError && <ErrorMessageTable message={error?.message} />}
      <div className="flex gap-2 flex-wrap">
        <LinkToUserTable />
        <p className="border rounded-md p-2">
          Общее количество заявок: {deals?.length}
        </p>
      </div>
      <DataTable
        columns={Columns(dealType as DealsUnionType) as ColumnDef<DealBase>[]}
        data={deals as DealBase[]}
        hasEditDeleteActions={false}
      />
    </DealTableTemplate>
  );
};

export default withAuthGuard(SummaryTable);
