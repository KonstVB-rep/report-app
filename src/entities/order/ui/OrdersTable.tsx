"use client";

import { ColumnDef } from "@tanstack/react-table";

import { JSX } from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import ButtonsGroupTable from "@/entities/deal/ui/ButtonsGroupTable";
import DealsSkeleton from "@/entities/deal/ui/DealsSkeleton";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton";
import useStoreUser from "@/entities/user/store/useStoreUser";
import withAuthGuard from "@/shared/lib/hoc/withAuthGuard";

import { DealTypeLabels } from "../../../app/dashboard/table/[departmentId]/[dealType]/ui/PersonTable";
import { useGetOrders } from "../hooks/query";
import { columnsOrder } from "../model/columns-data-orders";

const DataOrderTable = dynamic(() => import("./DataOrderTable"), {
  ssr: false,
  loading: () => <TableRowsSkeleton />,
}) as <T extends { id: string }>(props: {
  columns: ColumnDef<T, unknown>[];
  data: T[];
}) => JSX.Element;

const OrdersTable = () => {
  const { data: orders, isPending } = useGetOrders();
  const { userId, dealType } = useParams();
  const { authUser } = useStoreUser();
  const isPageAuthUser = userId === authUser?.id;

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

        {isPageAuthUser && <ButtonsGroupTable />}
        <DataOrderTable columns={columnsOrder} data={orders ?? []} />
      </>
    </DealTableTemplate>
  );
};

export default withAuthGuard(OrdersTable);
