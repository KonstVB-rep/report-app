"use client";

import { PermissionEnum } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
import {
  ContractResponse,
  ProjectResponse,
  RetailResponse,
  TableType,
} from "@/entities/deal/types";
import ButtonsGroupTable from "@/entities/deal/ui/ButtonsGroupTable";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton";
import { useDealsUser } from "@/feature/deals/api/hooks/query";
import AccessDeniedMessage from "@/shared/custom-components/ui/AccessDeniedMessage";
import NotFoundByPosition from "@/shared/custom-components/ui/Redirect/NotFoundByPosition";
import { DealBase } from "@/shared/custom-components/ui/Table/model/types";

import { columnsDataContract } from "../model/columns-data-contracts";
import { columnsDataProject } from "../model/columns-data-project";
import { columnsDataRetail } from "../model/columns-data-retail";

export const DealTypeLabels: Record<string, string> = {
  projects: "Проекты",
  retails: "Розничные сделки",
  contracts: "Договора",
  orders: "Заявки",
};

const DealsTable = dynamic(() => import("@/widgets/deal/ui/DealsTable"), {
  ssr: false,
  loading: () => <TableRowsSkeleton />,
});

const Columns = (
  type: TableType
):
  | ColumnDef<ProjectResponse, unknown>[]
  | ColumnDef<RetailResponse, unknown>[]
  | ColumnDef<ContractResponse, unknown>[] => {
  switch (type) {
    case "projects":
      return columnsDataProject;
    case "retails":
      return columnsDataRetail;
    case "contracts":
      return columnsDataContract;
    default:
      throw new Error(`Unknown table type: ${type}`);
  }
};

// const getRowLink = (row: DealBase): string => {
//   if (row.type === 'PROJECT') {
//     return `/dashboard/deal/project/${row.id}`;
//   }
//   else if (row.type === 'RETAIL') {
//     return `/dashboard/deal/retail/${row.id}`;
//   }
//   else if (row.type === 'ORDER') {
//     return `/dashboard/orders/${row.id}`;
//   }else return ''
// };

const PersonDealsTable = () => {
  const { userId, dealType } = useParams<{
    userId: string;
    dealType: TableType;
  }>();

  const hasAccess = hasAccessToData(
    userId as string,
    PermissionEnum.VIEW_USER_REPORT
  );

  const { data = [] } = useDealsUser(
    dealType,
    hasAccess ? (userId as string) : undefined
  );

  if (!hasAccess)
    return (
      <AccessDeniedMessage
        error={{ message: "у вас нет доступа к этому разделу" }}
      />
    );

  return (
    <NotFoundByPosition>
      <DealTableTemplate>
        <>
          <div className="flex flex-wrap justify-between gap-3 w-full">
            <p className="border rounded-md p-2">
              {DealTypeLabels[dealType as string]}
            </p>
            <p className="border rounded-md p-2">
              Общее количество заявок: {data?.length}
            </p>
          </div>

          <ButtonsGroupTable />
          <DealsTable
            columns={Columns(dealType as TableType) as ColumnDef<DealBase>[]}
            data={data as DealBase[]}
          />
        </>
      </DealTableTemplate>
    </NotFoundByPosition>
  );
};

export default PersonDealsTable;
