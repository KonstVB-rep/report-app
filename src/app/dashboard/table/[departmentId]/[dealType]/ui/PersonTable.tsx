"use client";

import { DealType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import React from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import ButtonsGroupTable from "@/entities/deal/ui/ButtonsGroupTable";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton";
import useStoreUser from "@/entities/user/store/useStoreUser";

export const DealTypeLabels: Record<string, string> = {
  projects: "Проекты",
  retails: "Розничные сделки",
  // contracts: "Договора",
  orders: "Заявки"
 }

const DataTable = dynamic(() => import("@/shared/ui/Table/DataTable"), {
  ssr: false,
  loading: () => <TableRowsSkeleton />,
});

interface PersonTableProps<T> {
  data: T[];
  type: DealType;
  columns: ColumnDef<T>[];
  getRowLink?: (row: T, type: string) => string;
}

const PersonTable = <T extends { id: string }>({
  data,
  type,
  columns,
  getRowLink,
}: PersonTableProps<T>) => {
  const { userId, dealType } = useParams();
  const { authUser } = useStoreUser();
  const isPageAuthuser = userId === authUser?.id;

  return (
    <DealTableTemplate>
      <>
        <div className="flex flex-wrap justify-between gap-3 w-full">
          <p className="border rounded-md p-2">{DealTypeLabels[dealType as string]}</p><p className="border rounded-md p-2">Общее количество заявок: {data.length}</p>
        </div>

        {isPageAuthuser && <ButtonsGroupTable />}
        <DataTable
          columns={columns as ColumnDef<Record<string, unknown>, unknown>[]}
          data={data as Record<string, unknown>[]}
          getRowLink={
            getRowLink as (row: Record<string, unknown>, type: string) => string
          }
          type={type}
        />
      </>
    </DealTableTemplate>
  );
};

export default PersonTable;
