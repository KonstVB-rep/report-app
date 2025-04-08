"use client";
import React from "react";

import { DealType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import ButtonsGroupTable from "@/entities/deal/ui/ButtonsGroupTable";
import DealTableTemplate from "@/entities/deal/ui/DealTableTemplate";
import useStoreUser from "@/entities/user/store/useStoreUser";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import TableRowsSkeleton from "@/entities/deal/ui/Skeletons/TableRowsSkeleton";

const DataTable = dynamic(() => import("@/shared/ui/Table/DataTable"), {
  ssr: false,
  loading: () => <TableRowsSkeleton/>,
});

interface PersonTableProps<T> {
  data: T[];
  type: DealType;
  columns: ColumnDef<T>[]; // Можешь уточнить тип колонок, если он известен
  getRowLink: (row: T, type: string) => string;
}

const PersonTable = <T extends { id: string }>({
  data,
  type,
  columns,
  getRowLink,
}: PersonTableProps<T>) => {
  const { userId } = useParams();
  const { authUser } = useStoreUser();
  const isPageAuthuser = userId === authUser?.id;


  return (
    <DealTableTemplate>
      <>
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
