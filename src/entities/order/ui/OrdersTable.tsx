"use client";

// import { DealType } from "@prisma/client";
// import { useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";

import { useParams } from "next/navigation";

import ButtonsGroupTable from "@/entities/deal/ui/ButtonsGroupTable";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import useStoreUser from "@/entities/user/store/useStoreUser";
// import { hasAccessToData } from "@/entities/deal/lib/hasAccessToData";
// import { RetailResponse } from "@/entities/deal/types";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import { columnsOrder } from "../model/columns-data-orders";
import { DealTypeLabels } from "../../../app/(dashboard)/table/[departmentId]/[dealType]/ui/PersonTable";
// import DataOrderTable from "./DataOrderTable";
import DealsSkeleton from "@/entities/deal/ui/DealsSkeleton";
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton";
import { JSX } from "react";
import { useGetOrders } from "../hooks/query";


const DataOrderTable = dynamic(() => import("./DataOrderTable"), {
  ssr: false,
  loading: () => <TableRowsSkeleton />,
}) as <T extends { id: string }>(props: {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  // getRowLink: (row: T, type: DealType) => string;
  // isExistActionDeal: boolean;
  // type: DealType;
}) => JSX.Element

// const AccessDeniedMessage = dynamic(
//   () => import("@/shared/ui/AccessDeniedMessage"),
//   { ssr: false }
// );

const OrdersTable = () => {
  // const hasAccess = hasAccessToData(
  //   userId as string,
  //   PermissionEnum.VIEW_USER_REPORT
  // );

  const { data: orders, isPending } = useGetOrders();
  const { userId, dealType } = useParams();
  const { authUser } = useStoreUser();
  const isPageAuthuser = userId === authUser?.id;

  //   const getRowLink = useCallback(
  //     (row: RetailResponse) => `/deal/retail/${row.id}`,
  //     []
  //   );

  //   if (!hasAccess)
  //     return (
  //       <AccessDeniedMessage
  //         error={{ message: "у вас нет доступа к этому разделу" }}
  //       />
  //     );

   if (isPending) return <DealsSkeleton />;

  return (
    <DealTableTemplate>
      <>
        <div className="flex flex-wrap justify-between gap-3 w-full">
          <p className="border rounded-md p-2">
            {DealTypeLabels[dealType as string]}
          </p>
          <p className="border rounded-md p-2">
            Общее количество заявок: {orders?.length}
          </p>
        </div>

        {isPageAuthuser && <ButtonsGroupTable />}
        <DataOrderTable
          columns={
            columnsOrder
          }
          data={orders ?? []}
          // getRowLink={
          //   getRowLink as (row: Record<string, unknown>, type: string) => string
          // }
        />
      </>
    </DealTableTemplate>
  );
};

export default withAuthGuard(OrdersTable);
